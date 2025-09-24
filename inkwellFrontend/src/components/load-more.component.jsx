import { useState } from "react";

const LoadMore = ({ state, fetchData }) => {
    const [loading, setLoading] = useState(false);

    const handleLoadMore = () => {
        setLoading(true);
        fetchData();
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    return (
        <button
            className="btn-dark mx-auto"
            onClick={handleLoadMore}
            disabled={loading}
        >
            {loading ? "Loading..." : "Load More"}
        </button>
    );
};

export default LoadMore;
