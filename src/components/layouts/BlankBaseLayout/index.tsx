import React from 'react';
import Head from 'next/head';

export interface BlankBaseLayoutProps {
    page: {
        title: string;
        meta?: {
            title?: string;
            description?: string;
            ogImage?: string;
        };
    };
    site: any;
    children: React.ReactNode;
}

export default function BlankBaseLayout(props: BlankBaseLayoutProps) {
    const { page, children } = props;
    const title = page.meta?.title || page.title;
    const description = page.meta?.description;
    const ogImage = page.meta?.ogImage;
    
    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>{title}</title>
                {description && <meta name="description" content={description} />}
                {ogImage && <meta property="og:image" content={ogImage} />}
            </Head>
            
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
}

import * as React from 'react';
import Head from 'next/head';
import classNames from 'classnames';

export default function BlankBaseLayout(props) {
    const { page, site } = props;
    const { enableAnnotations = true } = site;
    const pageMeta = page?.__metadata || {};
    return (
        <div className={classNames('sb-page', pageMeta.pageCssClasses)} {...(enableAnnotations && { 'data-sb-object-id': pageMeta.id })}>
            <Head>
                <title>{page.title}</title>
                <meta name="description" content="Components Library" />
                {site.favicon && <link rel="icon" href={site.favicon} />}
            </Head>
            {props.children}
        </div>
    );
}
