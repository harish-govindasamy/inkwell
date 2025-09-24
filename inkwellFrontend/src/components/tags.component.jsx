import { Link, useNavigate } from "react-router-dom";

const Tags = ({ tags, insideLink = false }) => {
    const navigate = useNavigate();
    
    if (!tags || tags.length === 0) {
        return null;
    }

    const handleTagClick = (e, tag) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/search?tag=${tag}`);
    };

    return (
        <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, i) => (
                insideLink ? (
                    <div
                        key={i}
                        className="btn-light py-1 px-3 text-sm cursor-pointer"
                        onClick={(e) => handleTagClick(e, tag)}
                    >
                        #{tag}
                    </div>
                ) : (
                    <Link
                        key={i}
                        to={`/search?tag=${tag}`}
                        className="btn-light py-1 px-3 text-sm"
                    >
                        #{tag}
                    </Link>
                )
            ))}
        </div>
    );
};

export default Tags;
