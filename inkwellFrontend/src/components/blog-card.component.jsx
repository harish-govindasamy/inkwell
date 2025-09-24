import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import Tags from "./tags.component";
import { formatDate } from "../common/date";

const BlogCard = ({ content, author }) => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(content.activity.total_likes);

    const checkIfLiked = () => {
        if (access_token) {
            fetch(import.meta.env.VITE_SERVER_DOMAIN + `/is-liked-by-user?_id=${content._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                }
            })
            .then(p => p.json())
            .then(data => {
                setIsLiked(data.result);
            })
            .catch(err => {
                console.log("Error checking like status");
            });
        }
    };

    useEffect(() => {
        checkIfLiked();
    }, [content._id, access_token]);

    const handleLike = (e) => {
        e.preventDefault();
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
                _id: content._id,
                isLikedByUser: isLiked
            })
        })
        .then(p => p.json())
        .then(data => {
            toast.dismiss(loadingToast);
            if (data.total_likes !== undefined) {
                setIsLiked(!isLiked);
                setLikesCount(prev => prev + data.total_likes);
                toast.success(isLiked ? "Removed like" : "Liked blog");
            }
        })
        .catch(err => {
            toast.dismiss(loadingToast);
            toast.error("Error updating like");
        });
    };

    return (
        <Link to={`/blog/${content.blog_id}`} className="flex gap-8 items-center border-b border-grey pb-5 mb-4">
            <div className="w-full">
                <div className="flex gap-2 mb-7 items-center">
                    <img src={author.personal_info.profile_img} className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1">@{author.personal_info.username}</p>
                    <p className="min-w-fit">{formatDate(content.publishedAt)}</p>
                </div>

                <h1 className="blog-title">{content.title}</h1>
                <p className="my-3 text-xl leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">{content.des}</p>

                <div className="flex gap-4 mt-7">
                    <Tags tags={content.tags} />
                    <button 
                        className={`ml-3 flex items-center gap-2 ${isLiked ? "text-red-500" : "text-dark-grey"}`}
                        onClick={handleLike}
                    >
                        <i className={`fi ${isLiked ? "fi-sr-heart" : "fi-rr-heart"}`}></i>
                        {likesCount}
                    </button>
                </div>
            </div>

            <div className="h-28 w-48 bg-grey">
                <img src={content.banner} className="w-full h-full aspect-video object-cover" />
            </div>
        </Link>
    );
};

export default BlogCard;
