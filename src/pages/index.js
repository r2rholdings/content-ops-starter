import React from 'react';
import { getComponent } from '../components/components-registry';

export default function Home(props) {
  // Use the same pattern as the catch-all route handler
  // For debugging, render a simple message to confirm the page is loading
  const PageLayout = getComponent('PageLayout');
  
  // Basic content for testing
  const pageProps = {
    __metadata: {
      modelName: 'PageLayout',
      urlPath: '/'
    },
    title: 'R2R Pharma - Home',
    sections: [
      {
        __metadata: {
          modelName: 'GenericSection'
        },
        title: 'Welcome to R2R Pharma',
        subtitle: 'Comprehensive GLP Injectable Solutions for Providers',
        text: 'Our homepage is currently being set up. Please check back soon for our complete services and information.',
        colors: 'bg-light-fg-dark',
        styles: {
          self: {
            height: 'auto',
            width: 'wide',
            margin: ['mt-0', 'mb-0', 'ml-0', 'mr-0'],
            padding: ['pt-12', 'pb-12', 'pl-4', 'pr-4'],
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'col'
          },
          title: {
            textAlign: 'center'
          },
          subtitle: {
            textAlign: 'center'
          },
          text: {
            textAlign: 'center'
          }
        }
      }
    ]
  };

  return <PageLayout {...pageProps} />;
}

// Static props to match the pattern in [[...slug]].js
export function getStaticProps() {
  return {
    props: {}
  };
}

import React from 'react';
import { allContent } from '../utils/local-content';
import { resolveStaticProps } from '../utils/static-props-resolvers';
import { getComponent } from '../components/components-registry';

export default function HomePage(props) {
  const { page, site } = props;
  const PageLayout = getComponent('PageLayout');

  return (
    <PageLayout page={page} site={site}>
      {page.sections && page.sections.length > 0 && (
        <React.Fragment>
          {page.sections.map((section, index) => {
            const Component = getComponent(section.type);
            if (!Component) {
              console.error(`No component found for section type: ${section.type}`);
              return null;
            }
            return <Component key={index} {...section} />;
          })}
        </React.Fragment>
      )}
    </PageLayout>
  );
}

export async function getStaticProps() {
  console.log('Resolving static props for path: /');
  
  try {
    const { site, page } = await resolveStaticProps('/');
    
    return {
      props: {
        page,
        site
      }
    };
  } catch (error) {
    console.error('Error resolving static props for homepage:', error);
    return {
      props: {
        error: 'Could not load page content'
      }
    };
  }
}

