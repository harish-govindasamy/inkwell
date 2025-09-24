import { Link } from "react-router-dom";

const TrendingBlogCard = ({ blog, index }) => {
    return (
        <Link to={`/blog/${blog.blog_id}`} className="flex gap-5 mb-8">
            <h1 className="blog-index">#{index + 1}</h1>
            <div>
                <div className="flex gap-2 mb-3 items-center">
                    <img src={blog.author.personal_info.profile_img} className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1">@{blog.author.personal_info.username}</p>
                </div>
                <h1 className="font-medium text-xl line-clamp-2">{blog.title}</h1>
                <p className="text-sm opacity-75">{blog.publishedAt}</p>
            </div>
        </Link>
    );
};

export default TrendingBlogCard;
