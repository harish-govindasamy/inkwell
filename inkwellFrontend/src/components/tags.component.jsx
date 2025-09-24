import { Link } from "react-router-dom";

const Tags = ({ tags }) => {
    if (!tags || tags.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, i) => (
                <Link
                    key={i}
                    to={`/search?tag=${tag}`}
                    className="btn-light py-1 px-3 text-sm"
                >
                    #{tag}
                </Link>
            ))}
        </div>
    );
};

export default Tags;
