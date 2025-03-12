import React from 'react';
import { Header } from '../../sections/Header';
import { Footer } from '../../sections/Footer';
import Head from 'next/head';

export interface DefaultBaseLayoutProps {
    page: {
        title: string;
        meta?: {
            title?: string;
            description?: string;
            ogImage?: string;
        };
    };
    site: {
        header?: any;
        footer?: any;
    };
    children: React.ReactNode;
}

export default function DefaultBaseLayout(props: DefaultBaseLayoutProps) {
    const { page, site, children } = props;
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
            
            {site.header && (
                <Header {...site.header} />
            )}
            
            <main className="flex-grow">
                {children}
            </main>
            
            {site.footer && (
                <Footer {...site.footer} />
            )}
        </div>
    );
}

import * as React from 'react';
import classNames from 'classnames';
import Header from '../../sections/Header';
import Footer from '../../sections/Footer';

export default function DefaultBaseLayout(props) {
    const { page, site } = props;
    const { enableAnnotations = true } = site;
    const pageMeta = page?.__metadata || {};

    return (
        <div className={classNames('sb-page', pageMeta.pageCssClasses)} {...(enableAnnotations && { 'data-sb-object-id': pageMeta.id })}>
            <div className="sb-base sb-default-base-layout">
                {site.header && <Header {...site.header} enableAnnotations={enableAnnotations} />}
                {props.children}
                {site.footer && <Footer {...site.footer} enableAnnotations={enableAnnotations} />}
            </div>
        </div>
    );
}
