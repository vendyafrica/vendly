"use client";

import { VisualEditing as SanityVisualEditing } from "next-sanity/visual-editing";
import { useEffect, useState } from "react";

export default function VisualEditing() {
    const [inIframe, setInIframe] = useState(false);

    useEffect(() => {
        setInIframe(window.self !== window.top);
    }, []);

    if (process.env.NODE_ENV !== "development" && !inIframe) {
        return null;
    }

    return <SanityVisualEditing />;
}
