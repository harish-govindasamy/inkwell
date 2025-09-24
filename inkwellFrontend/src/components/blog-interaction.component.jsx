import { useContext, useState, useEffect } from "react";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";

const BlogInteraction = ({ blog, isLikedByUser, setIsLikedByUser, commentsWrapper, setCommentsWrapper }) => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const [likesCount, setLikesCount] = useState(blog.activity.total_likes);

    const checkIfLiked = () => {
        if (access_token) {
            fetch(import.meta.env.VITE_SERVER_DOMAIN + `/is-liked-by-user?_id=${blog._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                }
            })
            .then(p => p.json())
            .then(data => {
                setIsLikedByUser(data.result);
            })
            .catch(err => {
                console.log("Error checking like status");
            });
        }
    };

    useEffect(() => {
        checkIfLiked();
    }, [blog._id, access_token]);

    const handleLike = () => {
        if (!access_token) {
            return toast.error("Login to like a blog");
        }

        let loadingToast = toast.loading("Updating like...");

        fetch(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body: JSON.stringify({
                _id: blog._id,
                isLikedByUser: isLikedByUser
            })
        })
        .then(p => p.json())
        .then(data => {
            toast.dismiss(loadingToast);
            if (data.total_likes !== undefined) {
                setIsLikedByUser(!isLikedByUser);
                setLikesCount(prev => prev + data.total_likes);
                toast.success(isLikedByUser ? "Removed like" : "Liked blog");
            }
        })
        .catch(err => {
            toast.dismiss(loadingToast);
            toast.error("Error updating like");
        });
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
                {likesCount}
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
