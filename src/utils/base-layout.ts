import React from 'react';
import { components } from '../components/components-registry';

/**
 * Represents the props for a base layout component
 */
export interface BaseLayoutProps {
  page: any;
  site: any;
  children: React.ReactNode;
}

/**
 * Type for a base layout component that takes BaseLayoutProps
 */
export type BaseLayoutComponent = React.ComponentType<BaseLayoutProps>;

/**
 * Retrieves the base layout component based on the page configuration
 * Falls back to DefaultBaseLayout if the specified layout doesn't exist
 * 
 * @param page - The page object containing configuration
 * @returns The resolved base layout component
 */
export function getBaseLayoutComponent(page: any): BaseLayoutComponent {
  if (!page) {
    console.warn('getBaseLayoutComponent: page object is undefined or null');
    return components?.DefaultBaseLayout || FallbackLayout;
  }

  try {
    // Get the base layout name from the page config, or use 'DefaultBaseLayout' as default
    const baseLayoutName = page.baseLayout || 'DefaultBaseLayout';
    
    // Check if the component exists in the registry
    const BaseLayout = components?.[baseLayoutName];
    
    if (!BaseLayout) {
      console.warn(`Base layout "${baseLayoutName}" not found, using DefaultBaseLayout instead`);
      return components?.DefaultBaseLayout || FallbackLayout;
    }
    
    return BaseLayout;
  } catch (error) {
    console.error('Error resolving base layout component:', error);
    return components?.DefaultBaseLayout || FallbackLayout;
  }
}

/**
 * A fallback layout component used when no suitable layout component is found
 * Provides a basic layout with error message
 */
const FallbackLayout: BaseLayoutComponent = ({ children }) => {
  return (
    <div className="fallback-layout">
      <div className="fallback-layout__header" style={{ padding: '1rem', background: '#f0f0f0', borderBottom: '1px solid #ddd' }}>
        <h1>Site Header (Fallback)</h1>
      </div>
      <div className="fallback-layout__content" style={{ padding: '2rem' }}>
        <div className="fallback-layout__warning" style={{ padding: '1rem', margin: '1rem 0', background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '0.25rem' }}>
          <p>Warning: Using fallback layout. The base layout component could not be found.</p>
        </div>
        {children}
      </div>
      <div className="fallback-layout__footer" style={{ padding: '1rem', background: '#f0f0f0', borderTop: '1px solid #ddd', marginTop: '2rem' }}>
        <p>Site Footer (Fallback)</p>
      </div>
    </div>
  );
};

/**
 * Creates a wrapper component that applies the base layout
 * 
 * @param WrappedComponent - The component to wrap with the base layout
 * @returns A new component with the base layout applied
 */
export function withBaseLayout<P extends object>(WrappedComponent: React.ComponentType<P>): React.ComponentType<P & { page: any; site: any }> {
  return function WithBaseLayout(props: P & { page: any; site: any }) {
    try {
      const { page, site, ...componentProps } = props;
      const BaseLayout = getBaseLayoutComponent(page);
      
      return (
        <BaseLayout page={page} site={site}>
          <WrappedComponent {...(componentProps as P)} />
        </BaseLayout>
      );
    } catch (error) {
      console.error('Error in withBaseLayout HOC:', error);
      return <FallbackLayout page={props.page} site={props.site}>
        <WrappedComponent {...(props as P)} />
      </FallbackLayout>;
    }
  };
}

/**
 * Utility function to check if a component is a valid React component
 * 
 * @param component - The component to check
 * @returns Boolean indicating if the component is valid
 */
export function isValidComponent(component: any): boolean {
  return component && (
    typeof component === 'function' || 
    (typeof component === 'object' && 'render' in component)
  );
}

import DefaultBaseLayout from '../components/layouts/DefaultBaseLayout';
import BlankBaseLayout from '../components/layouts/BlankBaseLayout';

export function getBaseLayoutComponent(pageBaseLayout, siteConfigBaseLayout) {
    const layout = pageBaseLayout || siteConfigBaseLayout || 'DefaultBaseLayout';
    let BaseLayout;
    if (layout === 'DefaultBaseLayout') {
        BaseLayout = DefaultBaseLayout;
    } else if (layout === 'BlankBaseLayout') {
        BaseLayout = BlankBaseLayout;
    } else {
        BaseLayout = DefaultBaseLayout;
    }
    if (!BaseLayout) {
        throw new Error(`no BaseLayout: ${pageBaseLayout} or ${siteConfigBaseLayout}`);
    }
    return BaseLayout;
}
