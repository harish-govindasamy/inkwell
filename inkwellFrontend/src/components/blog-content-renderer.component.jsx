const BlogContentRenderer = ({ content }) => {
    // Handle empty or invalid content
    if (!content) {
        return (
            <div className="font-gelasio">
                <p className="text-xl leading-8 my-4 text-dark-grey">No content available</p>
            </div>
        );
    }

    // Handle different content structures
    let blocks = [];
    
    if (Array.isArray(content)) {
        // Check if it's an array of EditorJS objects
        if (content.length > 0 && content[0].blocks && Array.isArray(content[0].blocks)) {
            // EditorJS format wrapped in an array
            blocks = content[0].blocks;
        } else {
            // Direct array of blocks
            blocks = content;
        }
    } else if (content.blocks && Array.isArray(content.blocks)) {
        // If content has a blocks property
        blocks = content.blocks;
    } else if (typeof content === 'string') {
        // If content is a string, try to parse it
        try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].blocks) {
                blocks = parsed[0].blocks;
            } else if (parsed.blocks && Array.isArray(parsed.blocks)) {
                blocks = parsed.blocks;
            } else if (Array.isArray(parsed)) {
                blocks = parsed;
            }
        } catch (e) {
            // If parsing fails, treat as plain text
            return (
                <div className="font-gelasio">
                    <p className="text-xl leading-8 my-4">{content}</p>
                </div>
            );
        }
    } else if (content.time && content.blocks) {
        // EditorJS format with time and blocks
        blocks = content.blocks;
    } else {
        // Unknown format, try to display something useful
        return (
            <div className="font-gelasio">
                <p className="text-xl leading-8 my-4 text-dark-grey">Content format not supported</p>
            </div>
        );
    }

    if (!Array.isArray(blocks) || blocks.length === 0) {
        return (
            <div className="font-gelasio">
                <p className="text-xl leading-8 my-4 text-dark-grey">No content blocks found</p>
            </div>
        );
    }

    return (
        <div className="font-gelasio">
            {blocks.map((block, i) => {
                if (block.type === "header") {
                    const level = block.data.level || 1;
                    const Tag = `h${level}`;
                    const sizeClasses = {
                        1: "text-4xl font-bold my-6",
                        2: "text-3xl font-bold my-5",
                        3: "text-2xl font-semibold my-4",
                        4: "text-xl font-semibold my-3",
                        5: "text-lg font-semibold my-2",
                        6: "text-base font-semibold my-2"
                    };
                    
                    return (
                        <Tag key={i} className={sizeClasses[level] || sizeClasses[2]}>
                            {block.data.text}
                        </Tag>
                    );
                }
                if (block.type === "paragraph") {
                    return (
                        <p key={i} className="text-xl leading-8 my-4">
                            {block.data.text}
                        </p>
                    );
                }
                if (block.type === "list") {
                    const ListTag = block.data.style === "ordered" ? "ol" : "ul";
                    const listClass = block.data.style === "ordered" 
                        ? "my-4 ml-8 list-decimal" 
                        : "my-4 ml-8 list-disc";
                    
                    return (
                        <ListTag key={i} className={listClass}>
                            {block.data.items.map((item, j) => (
                                <li key={j} className="text-xl leading-8 my-2">
                                    {item}
                                </li>
                            ))}
                        </ListTag>
                    );
                }
                if (block.type === "code") {
                    return (
                        <pre key={i} className="bg-grey p-4 rounded-md my-4 overflow-x-auto">
                            <code>{block.data.code}</code>
                        </pre>
                    );
                }
                if (block.type === "quote") {
                    return (
                        <blockquote key={i} className="border-l-4 border-twitter pl-6 py-2 my-6 bg-grey/30 italic">
                            <p className="text-xl leading-8 text-dark-grey">
                                {block.data.text}
                            </p>
                            {block.data.caption && (
                                <cite className="text-sm text-dark-grey/70 mt-2 block">
                                    — {block.data.caption}
                                </cite>
                            )}
                        </blockquote>
                    );
                }
                if (block.type === "image") {
                    return (
                        <img key={i} src={block.data.file?.url || block.data.url} alt={block.data.caption} className="w-full my-4" />
                    );
                }
                if (block.type === "linkTool") {
                    const { link, meta } = block.data;
                    
                    // If no meta data available, render simple link
                    if (!meta || (!meta.title && !meta.description && !meta.image)) {
                        try {
                            const domain = new URL(link).hostname;
                            return (
                                <div key={i} className="my-6 p-4 border border-grey rounded-lg bg-grey/30 hover:bg-grey/50 transition-colors">
                                    <a 
                                        href={link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="block no-underline"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                                <i className="fi fi-rr-link text-dark-grey"></i>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-lg font-medium text-black mb-1 hover:text-purple transition-colors">
                                                    {domain}
                                                </p>
                                                <p className="text-sm text-dark-grey break-all">
                                                    {link}
                                                </p>
                                            </div>
                                            <i className="fi fi-rr-arrow-up-right-from-square text-dark-grey"></i>
                                        </div>
                                    </a>
                                </div>
                            );
                        } catch (e) {
                            // Fallback for invalid URLs
                            return (
                                <div key={i} className="my-6 p-4 border border-grey rounded-lg bg-grey/30">
                                    <a 
                                        href={link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-purple hover:text-purple/80 underline break-all"
                                    >
                                        {link}
                                    </a>
                                </div>
                            );
                        }
                    }
                    
                    // Rich link preview with meta data
                    return (
                        <div key={i} className="my-6 border border-grey rounded-lg overflow-hidden hover:border-dark-grey transition-colors">
                            <a 
                                href={link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block no-underline"
                            >
                                {meta?.image && (
                                    <div className="aspect-video w-full overflow-hidden">
                                        <img 
                                            src={meta.image.url} 
                                            alt={meta.title || "Link preview"} 
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-black mb-2 hover:text-purple transition-colors line-clamp-2">
                                        {meta?.title || new URL(link).hostname}
                                    </h3>
                                    {meta?.description && (
                                        <p className="text-dark-grey text-base leading-6 mb-3 line-clamp-3">
                                            {meta.description}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-dark-grey/70">
                                        <span>{new URL(link).hostname}</span>
                                        <i className="fi fi-rr-arrow-up-right-from-square"></i>
                                    </div>
                                </div>
                            </a>
                        </div>
                    );
                }
                // Fallback for unknown block types
                if (block.data && block.data.text) {
                    return (
                        <p key={i} className="text-xl leading-8 my-4">
                            {block.data.text}
                        </p>
                    );
                }
                
                // Last resort - render as JSON for debugging
                return (
                    <div key={i} className="bg-grey p-2 rounded my-2 text-sm">
                        <strong>Unknown block type: {block.type}</strong>
                        <pre className="mt-1 text-xs overflow-auto">
                            {JSON.stringify(block, null, 2)}
                        </pre>
                    </div>
                );
            })}
        </div>
    );
};

export default BlogContentRenderer;
