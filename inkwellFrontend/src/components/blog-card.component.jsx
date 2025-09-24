import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import Tags from "./tags.component";
import { formatDate } from "../common/date";

const BlogCard = ({ content, author }) => {
    const { userAuth: { access_token } } = useContext(UserContext);

    const handleLike = (e) => {
        e.preventDefault();
        if (access_token) {
            return toast.error("Login to like a blog");
        }
        // Like functionality will be implemented later
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
                    <span className="ml-3 flex items-center gap-2 text-dark-grey">
                        <i className="fi fi-rr-heart"></i>
                        {content.activity.total_likes}
                    </span>
                </div>
            </div>

            <div className="h-28 w-48 bg-grey">
                <img src={content.banner} className="w-full h-full aspect-video object-cover" />
            </div>
        </Link>
    );
};

export default BlogCard;
