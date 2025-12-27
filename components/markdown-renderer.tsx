"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                // Custom heading rendering with proper IDs for anchor links
                h1: ({ children, ...props }) => {
                    const id = children?.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
                    return <h1 id={id} {...props}>{children}</h1>;
                },
                h2: ({ children, ...props }) => {
                    const id = children?.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
                    return <h2 id={id} {...props}>{children}</h2>;
                },
                h3: ({ children, ...props }) => {
                    const id = children?.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
                    return <h3 id={id} {...props}>{children}</h3>;
                },
                // Custom link rendering for external links
                a: ({ href, children, ...props }) => {
                    const isExternal = href?.startsWith("http");
                    return (
                        <a
                            href={href}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noopener noreferrer" : undefined}
                            {...props}
                        >
                            {children}
                        </a>
                    );
                },
                // Custom table rendering for better styling
                table: ({ children, ...props }) => (
                    <div className="overflow-x-auto">
                        <table {...props}>{children}</table>
                    </div>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
