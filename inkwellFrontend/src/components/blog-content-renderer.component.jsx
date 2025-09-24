const BlogContentRenderer = ({ content }) => {
    return (
        <div className="font-gelasio">
            {content.blocks.map((block, i) => {
                if (block.type === "header") {
                    return (
                        <h1 key={i} className="text-3xl font-bold my-5">
                            {block.data.text}
                        </h1>
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
                    return (
                        <ul key={i} className="my-4">
                            {block.data.items.map((item, j) => (
                                <li key={j} className="text-xl leading-8 my-2">
                                    {item}
                                </li>
                            ))}
                        </ul>
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
                        <blockquote key={i} className="border-l-4 border-black pl-4 my-4 italic">
                            {block.data.text}
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
