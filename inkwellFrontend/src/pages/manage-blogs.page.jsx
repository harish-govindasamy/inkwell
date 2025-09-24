import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import NoData from "../components/nodata.component";
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const ManageBlogs = () => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const [blogs, setBlogs] = useState(null);
    const [activeTab, setActiveTab] = useState("published");

    const getUserBlogs = () => {
        fetch(import.meta.env.VITE_SERVER_DOMAIN + "/get-user-blogs", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            }
        })
        .then(p => p.json())
        .then(data => {
            if (data.blogs) {
                setBlogs(data.blogs);
            }
        })
        .catch(err => {
            toast.error("Error occurred while fetching blogs");
        });
    };

    const handleDeleteBlog = (blogId) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            fetch(import.meta.env.VITE_SERVER_DOMAIN + "/delete-blog", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                },
                body: JSON.stringify({ blogId })
            })
            .then(p => p.json())
            .then(data => {
                if (data.status === "Blog deleted") {
                    toast.success("Blog deleted successfully");
                    getUserBlogs();
                } else {
                    toast.error("Error deleting blog");
                }
            })
            .catch(err => {
                toast.error("Error deleting blog");
            });
        }
    };

    useEffect(() => {
        getUserBlogs();
    }, []);

    const publishedBlogs = blogs?.filter(blog => !blog.draft) || [];
    const draftBlogs = blogs?.filter(blog => blog.draft) || [];

    return (
        <AnimationWrapper>
            <Toaster />
            <section className="h-cover flex justify-center gap-10 mt-12">
                <div className="max-w-[900px] w-full">
                    <h1 className="text-4xl font-gelasio mb-8">Manage Blogs</h1>

                    <div className="flex gap-4 mb-8">
                        <button
                            className={`py-2 px-4 rounded-md ${activeTab === "published" ? "bg-black text-white" : "bg-grey"}`}
                            onClick={() => setActiveTab("published")}
                        >
                            Published ({publishedBlogs.length})
                        </button>
                        <button
                            className={`py-2 px-4 rounded-md ${activeTab === "drafts" ? "bg-black text-white" : "bg-grey"}`}
                            onClick={() => setActiveTab("drafts")}
                        >
                            Drafts ({draftBlogs.length})
                        </button>
                    </div>

                    {blogs === null ? (
                        <Loader />
                    ) : (
                        <div className="space-y-6">
                            {activeTab === "published" ? (
                                publishedBlogs.length ? (
                                    publishedBlogs.map((blog, i) => (
                                        <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }}>
                                            <div className="bg-grey p-6 rounded-md">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <h2 className="text-2xl font-gelasio mb-2">{blog.title}</h2>
                                                        <p className="text-dark-grey mb-2">{blog.des}</p>
                                                        <div className="flex gap-4 text-sm text-dark-grey">
                                                            <span>Likes: {blog.activity.total_likes}</span>
                                                            <span>Reads: {blog.activity.total_reads}</span>
                                                            <span>Comments: {blog.activity.total_comments}</span>
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
                                                            onClick={() => handleDeleteBlog(blog._id)}
                                                            className="btn-dark py-2 px-4 bg-red-500 hover:bg-red-600"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </AnimationWrapper>
                                    ))
                                ) : (
                                    <NoData message="No published blogs" />
                                )
                            ) : (
                                draftBlogs.length ? (
                                    draftBlogs.map((blog, i) => (
                                        <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }}>
                                            <div className="bg-grey p-6 rounded-md">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <h2 className="text-2xl font-gelasio mb-2">{blog.title}</h2>
                                                        <p className="text-dark-grey mb-2">Draft</p>
                                                    </div>
                                                    <div className="flex gap-2 ml-4">
                                                        <button
                                                            onClick={() => handleDeleteBlog(blog._id)}
                                                            className="btn-dark py-2 px-4 bg-red-500 hover:bg-red-600"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </AnimationWrapper>
                                    ))
                                ) : (
                                    <NoData message="No draft blogs" />
                                )
                            )}
                        </div>
                    )}
                </div>
            </section>
        </AnimationWrapper>
    );
};

export default ManageBlogs;
