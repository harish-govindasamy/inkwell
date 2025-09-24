import { useContext } from "react";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { formatDate } from "../common/date";

const ManageBlogCard = ({ blog, index }) => {
    const { userAuth: { access_token } } = useContext(UserContext);

    const handleDeleteBlog = () => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            fetch(import.meta.env.VITE_SERVER_DOMAIN + "/delete-blog", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                },
                body: JSON.stringify({ blogId: blog._id })
            })
            .then(p => p.json())
            .then(data => {
                if (data.status === "Blog deleted") {
                    toast.success("Blog deleted successfully");
                    window.location.reload();
                } else {
                    toast.error("Error deleting blog");
                }
            })
            .catch(err => {
                toast.error("Error deleting blog");
            });
        }
    };

    return (
        <div className="flex gap-4 items-center border-b border-grey pb-5 mb-4">
            <div className="w-full">
                <div className="flex gap-2 mb-7 items-center">
                    <p className="text-dark-grey">{formatDate(blog.publishedAt)}</p>
                    {blog.draft && <span className="btn-light py-1 px-3 text-sm">Draft</span>}
                </div>

                <h1 className="blog-title">{blog.title}</h1>
                <p className="my-3 text-xl leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">{blog.des}</p>

                <div className="flex gap-4 mt-7">
                    <span className="ml-3 flex items-center gap-2 text-dark-grey">
                        <i className="fi fi-rr-heart"></i>
                        {blog.activity.total_likes}
                    </span>
                    <span className="ml-3 flex items-center gap-2 text-dark-grey">
                        <i className="fi fi-rr-eye"></i>
                        {blog.activity.total_reads}
                    </span>
                    <span className="ml-3 flex items-center gap-2 text-dark-grey">
                        <i className="fi fi-rr-comment"></i>
                        {blog.activity.total_comments}
                    </span>
                </div>
            </div>

            <div className="flex gap-2 ml-4">
                <Link
                    to={`/blog/${blog.blog_id}`}
                    className="btn-light py-2 px-4"
                >
                    View
                </Link>
                <button
                    onClick={handleDeleteBlog}
                    className="btn-dark py-2 px-4 bg-red-500 hover:bg-red-600"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ManageBlogCard;
