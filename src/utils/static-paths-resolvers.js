import { getAllNonFeaturedPostsSorted, getAllCategoryPostsSorted, generatePagedPathsForPage, isPublished } from './data-utils';

export function resolveStaticPaths({ pages, objects }) {
    return pages.reduce((paths, page) => {
        if (!process.env.stackbitPreview && page.isDraft) {
            return paths;
        }
        
        try {
            const objectType = page.__metadata?.modelName;
            const pageUrlPath = page.__metadata?.urlPath;
            
            // If a resolver exists for this object type, use it
            if (objectType && StaticPathsResolvers[objectType]) {
                const resolver = StaticPathsResolvers[objectType];
                const resolvedPaths = resolver(page, objects);
                
                // Make sure resolver returned valid paths
                if (Array.isArray(resolvedPaths)) {
                    return paths.concat(resolvedPaths.filter(path => path != null));
                }
                
                // If resolver returned a single path
                if (resolvedPaths != null) {
                    return paths.concat(resolvedPaths);
                }
                
                return paths;
            }
            
            // Only add URL path if it exists
            if (pageUrlPath) {
                return paths.concat(pageUrlPath);
            }
            
            return paths;
        } catch (error) {
            console.error(`Error resolving paths for page: ${page?.__metadata?.id || 'unknown page'}`, error);
            return paths;
        }
    }, []);
}

const StaticPathsResolvers = {
    PostFeedLayout: (page, objects) => {
        try {
            let posts = getAllNonFeaturedPostsSorted(objects);
            if (!process.env.stackbitPreview) {
                posts = posts.filter(isPublished);
            }
            const numOfPostsPerPage = page.numOfPostsPerPage ?? 10;
            return generatePagedPathsForPage(page, posts, numOfPostsPerPage);
        } catch (error) {
            console.error(`Error resolving PostFeedLayout paths for page: ${page?.__metadata?.id || 'unknown page'}`, error);
            return [];
        }
    },
    PostFeedCategoryLayout: (page, objects) => {
        try {
            const categoryId = page.__metadata?.id;
            const numOfPostsPerPage = page.numOfPostsPerPage ?? 10;
            let categoryPosts = getAllCategoryPostsSorted(objects, categoryId);
            if (!process.env.stackbitPreview) {
                categoryPosts = categoryPosts.filter(isPublished);
            }
            return generatePagedPathsForPage(page, categoryPosts, numOfPostsPerPage);
        } catch (error) {
            console.error(`Error resolving PostFeedCategoryLayout paths for page: ${page?.__metadata?.id || 'unknown page'}`, error);
            return [];
        }
    }
};
