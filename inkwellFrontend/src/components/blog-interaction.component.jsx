import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";

const BlogInteraction = ({ blog, isLikedByUser, setIsLikedByUser, commentsWrapper, setCommentsWrapper }) => {
    const { userAuth: { access_token } } = useContext(UserContext);

    const handleLike = () => {
        if (access_token) {
            setIsLikedByUser(!isLikedByUser);
            // Like functionality will be implemented later
        } else {
            toast.error("Login to like a blog");
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: blog.title,
                text: blog.des,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard");
        }
    };

    return (
        <div className="flex gap-6 items-center my-8">
            <button
                className={`flex items-center gap-2 ${isLikedByUser ? "text-red-500" : "text-dark-grey"}`}
                onClick={handleLike}
            >
                <i className={`fi ${isLikedByUser ? "fi-sr-heart" : "fi-rr-heart"}`}></i>
                {blog.activity.total_likes}
            </button>

            <button
                className="flex items-center gap-2 text-dark-grey"
                onClick={() => setCommentsWrapper(!commentsWrapper)}
            >
                <i className="fi fi-rr-comment"></i>
                {blog.activity.total_comments}
            </button>

            <button
                className="flex items-center gap-2 text-dark-grey"
                onClick={handleShare}
            >
                <i className="fi fi-rr-share"></i>
                Share
            </button>
        </div>
    );
};

export default BlogInteraction;
