const BlogContentRenderer = ({ content }) => {
    // Handle empty or invalid content
    if (!content || !content.blocks || !Array.isArray(content.blocks)) {
        return (
            <div className="font-gelasio">
                <p className="text-xl leading-8 my-4 text-dark-grey">No content available</p>
            </div>
        );
    }

    return (
        <div className="font-gelasio">
            {content.blocks.map((block, i) => {
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
                        <img key={i} src={block.data.file.url} alt={block.data.caption} className="w-full my-4" />
                    );
                }
                return null;
            })}
        </div>
    );
};

export default BlogContentRenderer;
