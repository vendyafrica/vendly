import * as React from "react";

interface HeadingBlockProps {
    title: string;
    style?: React.CSSProperties;
}

export function HeadingBlock({ title, style }: HeadingBlockProps) {
    return (
        <div style={{ padding: 64, ...style }}>
            <h1 className="text-3xl font-bold">{title}</h1>
        </div>
    );
}
