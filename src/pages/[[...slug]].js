import React from 'react';
import Head from 'next/head';
import { allContent } from '../utils/local-content';
import { getComponent } from '../components/components-registry';
import { resolveStaticProps } from '../utils/static-props-resolvers';
import { resolveStaticPaths } from '../utils/static-paths-resolvers';
import { seoGenerateTitle, seoGenerateMetaTags, seoGenerateMetaDescription } from '../utils/seo-utils';

function Page(props) {
    const { page, site } = props;
    const { modelName } = page.__metadata;
    if (!modelName) {
        throw new Error(`page has no type, page '${props.path}'`);
    }
    const PageLayout = getComponent(modelName);
    if (!PageLayout) {
        throw new Error(`no page layout matching the page model: ${modelName}`);
    }
    const title = seoGenerateTitle(page, site);
    const metaTags = seoGenerateMetaTags(page, site);
    const metaDescription = seoGenerateMetaDescription(page, site);
    return (
        <>
            <Head>
                <title>{title}</title>
                {metaDescription && <meta name="description" content={metaDescription} />}
                {metaTags.map((metaTag) => {
                    if (metaTag.format === 'property') {
                        // OpenGraph meta tags (og:*) should be have the format <meta property="og:…" content="…">
                        return <meta key={metaTag.property} property={metaTag.property} content={metaTag.content} />;
                    }
                    return <meta key={metaTag.property} name={metaTag.property} content={metaTag.content} />;
                })}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {site.favicon && <link rel="icon" href={site.favicon} />}
            </Head>
            <PageLayout page={page} site={site} />
        </>
    );
}
export function getStaticPaths() {
    const data = allContent();
    const paths = resolveStaticPaths(data);
    
    // Log the paths for debugging
    console.log('Generated static paths:', JSON.stringify(paths, null, 2));
    
    return { paths, fallback: false };
}
export async function getStaticProps({ params }) {
    // Force reload of content to ensure we get the latest data
    const data = allContent();
    
    // Handle empty params.slug (homepage)
    const urlPath = params.slug ? '/' + (params.slug || []).join('/') : '/';

    console.log('Resolving static props for path:', urlPath);
    let props;
    try {
        props = await resolveStaticProps(urlPath, data);
    } catch (error) {
        console.error(`Error resolving static props for ${urlPath}:`, error);
        throw error;
    }
    
    // Ensure the site.footer is properly resolved
    if (props.site && props.site.footer && typeof props.site.footer === 'string' && props.site.footer.endsWith('.json')) {
        // Find the footer data in data.objects
        const footerData = data.objects.find(obj => obj.__metadata?.urlPath === props.site.footer);
        if (footerData) {
            // Replace the footer reference with the actual data
            props.site.footer = {
                logo: footerData.logo,
                text: footerData.text,
                primaryLinks: footerData.primaryLinks,
                secondaryLinks: footerData.secondaryLinks,
                socialLinks: footerData.socialLinks,
                legalLinks: footerData.legalLinks,
                copyrightText: footerData.copyrightText,
                colors: footerData.colors,
                type: footerData.type
            };
        } else {
            // If footer data not found, set to null to avoid serialization issues
            props.site.footer = null;
        }
    }
    // Ensure all props are serializable
    try {
        return {
            props: JSON.parse(JSON.stringify(props))
        };
    } catch (error) {
        console.error('Error serializing props:', error);
        console.error('Problem props:', JSON.stringify({
            page: props.page?.__metadata,
            site: {
                ...props.site,
                footer: typeof props.site?.footer === 'object' ? 'footer object' : props.site?.footer
            }
        }, null, 2));
        throw new Error(`Failed to serialize props for page ${urlPath}: ${error.message}`);
    }
}

export default Page;
