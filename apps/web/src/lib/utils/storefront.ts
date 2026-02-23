export function getStorefrontUrl(storeSlug: string, path: string = "") {
    const isLocalhost = process.env.NODE_ENV === "development";
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "shopvendly.store";

    // Ensure path starts with a slash if it's provided
    const formattedPath = path && !path.startsWith("/") ? `/${path}` : path;

    if (isLocalhost) {
        return `http://${storeSlug}.localhost:3000${formattedPath}`;
    }

    return `https://${storeSlug}.${rootDomain}${formattedPath}`;
}

export function getRootUrl(path: string = "") {
    const isLocalhost = process.env.NODE_ENV === "development";
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "shopvendly.store";
    const formattedPath = path && !path.startsWith("/") ? `/${path}` : path;

    if (isLocalhost) {
        return `http://localhost:3000${formattedPath}`;
    }

    return `https://${rootDomain}${formattedPath}`;
}

export function getStorefrontRelativePath(path: string = "") {
    // Return the relative path for links within the storefront
    return path && !path.startsWith("/") ? `/${path}` : (path || "/");
}   
