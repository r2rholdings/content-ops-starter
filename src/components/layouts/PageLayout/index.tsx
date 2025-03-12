import React, { useEffect, useState, ErrorInfo } from 'react';
import dynamic from 'next/dynamic';
import { getBaseLayoutComponent } from '../../../utils/base-layout';

// Define TypeScript interfaces
interface Section {
  type: string;
  title?: string;
  subtitle?: string;
  content?: string;
  styles?: Record<string, any>;
  actions?: Array<{
    type: string;
    label: string;
    url?: string;
    [key: string]: any;
  }>;
  media?: {
    type: string;
    url?: string;
    altText?: string;
    caption?: string;
    [key: string]: any;
  };
  items?: Array<any>;
  elementId?: string;
  variant?: string;
  colors?: string;
  [key: string]: any;
}

interface PageProps {
  page: {
    __metadata: {
      id: string;
      urlPath: string;
      modelName: string;
    };
    type: string;
    title: string;
    sections?: Section[];
    layout?: string;
    slug?: string;
    [key: string]: any;
  };
  site: {
    siteTitle?: string;
    siteDescription?: string;
    header?: any;
    footer?: any;
    [key: string]: any;
  };
  pageContext?: {
    locale?: string;
    urlPath?: string;
    [key: string]: any;
  };
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Error Boundary Component
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('PageLayout Error Boundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary-fallback">
          <h2>Something went wrong in this section.</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.toString()}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Dynamic component loader with debugging
const loadComponent = (type: string): React.ComponentType<any> | null => {
  try {
    const componentMap: Record<string, any> = require('../../../components/components-registry').default;
    const Component = componentMap[type];
    
    if (!Component) {
      console.warn(`Component of type "${type}" not found in registry`);
      return null;
    }
    
    return Component;
  } catch (error) {
    console.error(`Error loading component for type "${type}":`, error);
    return null;
  }
};

// Section renderer with error boundary
const SectionRenderer: React.FC<{ section: Section, index: number }> = ({ section, index }) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.debug(`[PageLayout] Attempting to load component for section type: ${section.type}`);
      const SectionComponent = loadComponent(section.type);
      setComponent(() => SectionComponent);
      
      if (SectionComponent) {
        console.debug(`[PageLayout] Successfully loaded component for section type: ${section.type}`);
      }
    } catch (error) {
      console.error(`[PageLayout] Failed to load component for section "${section.type}":`, error);
      setLoadError(`Failed to load component: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [section.type]);

  if (loadError) {
    return (
      <div className="section-error">
        <h3>Error Loading Section Component</h3>
        <p>{loadError}</p>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="section-loading">
        <p>Loading section component: {section.type}...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary
      key={`section-${index}`}
      onError={(error) => {
        console.error(`[PageLayout] Error rendering section ${section.type} at index ${index}:`, error);
      }}
      fallback={
        <div className="section-error-fallback">
          <h3>Error in section: {section.title || section.type}</h3>
          <p>There was a problem rendering this section. Please check the console for more details.</p>
        </div>
      }
    >
      <Component {...section} data-sb-object-id={section.elementId} />
    </ErrorBoundary>
  );
};

// Main PageLayout component
const PageLayout: React.FC<PageProps> = (props) => {
  const { page, site } = props;
  
  // Add debugging information
  useEffect(() => {
    console.debug('[PageLayout] Rendering page:', {
      title: page.title,
      urlPath: page.__metadata?.urlPath,
      sectionCount: page.sections?.length || 0
    });
  }, [page]);

  // Get the appropriate base layout component
  const BaseLayout = getBaseLayoutComponent(page);

  // If site data is missing, show a helpful error
  if (!site) {
    console.error('[PageLayout] Site data is missing or undefined');
    return (
      <div className="page-error">
        <h1>Site Configuration Error</h1>
        <p>The site configuration data could not be loaded. Please check your build configuration.</p>
      </div>
    );
  }

  // Handle the case where sections are not provided or empty
  const hasSections = Array.isArray(page.sections) && page.sections.length > 0;
  const hasMeta = !!page.__metadata;

  if (!hasMeta) {
    console.warn('[PageLayout] Page metadata is missing');
  }

  if (!hasSections) {
    console.debug('[PageLayout] No sections found in page data');
  }

  return (
    <ErrorBoundary
      onError={(error) => {
        console.error('[PageLayout] Top-level error in PageLayout:', error);
      }}
    >
      <BaseLayout page={page} site={site}>
        {hasSections ? (
          <main id="main" className="sb-layout sb-page-layout">
            {page.sections.map((section, index) => (
              <SectionRenderer 
                key={`${section.type}-${index}`}
                section={section}
                index={index}
              />
            ))}
          </main>
        ) : props.children ? (
          <main id="main" className="sb-layout sb-page-layout">
            {props.children}
          </main>
        ) : (
          <div className="no-content-message">
            <h2>No content sections found</h2>
            <p>This page does not have any content sections defined. Add sections in the content model to display content.</p>
          </div>
        )}
      </BaseLayout>
    </ErrorBoundary>
  );
};

export default PageLayout;

import React, { useEffect, useState, ErrorBoundary } from 'react';
import classNames from 'classnames';
import { getBaseLayoutComponent } from '../../../utils/base-layout';
import { getComponent } from '../../components-registry';
import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';
import { getDataAttrs } from '../../../utils/get-data-attrs';

export interface PageLayoutProps {
    page: {
        title?: string;
        sections?: any[];
        baseLayout?: string;
        meta?: any;
        __metadata?: {
            pageCssClasses?: string;
            modelName?: string;
        };
        __id?: string;
        styles?: {
            self?: any;
        };
    };
    site: {
        baseLayout?: string;
        enableAnnotations?: boolean;
    };
    children?: React.ReactNode;
}

/**
 * Error boundary component to catch rendering errors
 */
class PageErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('PageLayout Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="container mx-auto px-5 py-16 text-red-500">
                    <h1 className="text-2xl font-bold">Error rendering page</h1>
                    <p>{this.state.error?.message || 'Unknown error'}</p>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Main PageLayout component
 * Unified implementation that merges functionality from multiple versions
 */
export default function PageLayout(props: PageLayoutProps) {
    const { page, site, children } = props;
    const [error, setError] = useState<Error | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Log detailed information about props
    console.log('PageLayout props:', {
        title: page?.title,
        sectionsCount: page?.sections?.length || 0,
        baseLayout: page?.baseLayout,
        siteLayout: site?.baseLayout,
        hasChildren: !!children
    });
    
    // Validate required props
    if (!page) {
        console.error('PageLayout: Missing page data');
        return <div className="error-message">Error: Missing page data</div>;
    }
    
    // Get the base layout component based on configuration
    const BaseLayout = getBaseLayoutComponent(page.baseLayout, site?.baseLayout);
    console.log('BaseLayout resolution:', BaseLayout ? 'Successfully resolved' : 'Failed to resolve', { 
        pageBaseLayout: page.baseLayout, 
        siteBaseLayout: site?.baseLayout 
    });
    
    const { enableAnnotations = true } = site || {};
    const { title, sections = [] } = page;
    
    // Set loaded state when component mounts
    useEffect(() => {
        console.log("PageLayout mounted with page:", { 
            title: page.title,
            sectionsCount: sections.length,
            metadata: page.__metadata
        });
        setIsLoaded(true);
    }, [page]);

    // Handle error state
    if (error) {
        return (
            <BaseLayout page={page} site={site}>
                <div className="container mx-auto px-5 py-16 text-red-500">
                    <h1 className="text-2xl font-bold">Error rendering page</h1>
                    <p>{error.message}</p>
                </div>
            </BaseLayout>
        );
    }

    // Handle loading state
    if (!isLoaded) {
        return (
            <BaseLayout page={page} site={site}>
                <div className="container mx-auto px-5 py-16">
                    <p>Loading page content...</p>
                </div>
            </BaseLayout>
        );
    }

    // Render the sections if children aren't provided
    const renderSections = () => {
        if (children) {
            return children;
        }
        
        console.log('Rendering sections:', sections);

        if (!sections || sections.length === 0) {
            return (
                <div className="container mx-auto px-5 py-16">
                    <h1 className="text-4xl font-bold">{title}</h1>
                    <div className="mt-8 bg-gray-100 p-6 rounded">
                        <p>This page doesn't have any sections. Add sections in the content file.</p>
                    </div>
                </div>
            );
        }

        return (
            <div {...(enableAnnotations && { 'data-sb-field-path': 'sections' })}>
                {sections.map((section, index) => {
                    console.log(`Rendering section ${index}:`, {
                        type: section.type,
                        modelName: section.__metadata?.modelName
                    });
                    
                    // Get component using either modelName or type
                    const componentType = section.__metadata?.modelName || section.type;
                    if (!componentType) {
                        console.error('Section missing type/modelName:', section);
                        return null;
                    }
                    
                    const Component = getComponent(componentType);
                    if (!Component) {
                        console.error(`No component found for: ${componentType}`);
                        return (
                            <div key={index} className="bg-red-100 text-red-700 p
