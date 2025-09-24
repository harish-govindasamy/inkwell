import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import BlogContentRenderer from "./blog-content-renderer.component";
import BlogInteraction from "./blog-interaction.component";
import Comments from "./comments.component";
import { formatDate } from "../common/date";

const BlogContent = ({ blog, author, isLikedByUser, setIsLikedByUser, commentsWrapper, setCommentsWrapper }) => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const [similarBlogs, setSimilarBlogs] = useState(null);

    const getSimilarBlogs = () => {
        if (blog.tags && blog.tags.length > 0) {
            fetch(import.meta.env.VITE_SERVER_DOMAIN + `/search-blogs?tag=${blog.tags[0]}&author=${author._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(p => p.json())
            .then(data => {
                if (data.blogs) {
                    setSimilarBlogs(data.blogs.slice(0, 3)); // Get 3 similar blogs
                }
            })
            .catch(err => {
                console.log("Error fetching similar blogs");
            });
        }
    };

    useEffect(() => {
        getSimilarBlogs();
    }, [blog.tags, author._id]);

    return (
        <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
            <div className="w-full">
                <h1 className="text-4xl font-gelasio leading-tight">{blog.title}</h1>

                <div className="flex gap-4 mt-4 mb-8">
                    <img src={author.personal_info.profile_img} className="w-12 h-12 rounded-full" />
                    <div>
                        <p className="capitalize">{author.personal_info.fullname}</p>
                        <p className="text-dark-grey">@{author.personal_info.username}</p>
                    </div>
                    <p className="text-dark-grey ml-auto">{formatDate(blog.publishedAt)}</p>
                </div>

                {blog.banner && (
                    <img src={blog.banner} className="aspect-video w-full" />
                )}

                <div className="my-10">
                    <BlogContentRenderer content={blog.content} />
                </div>

                <BlogInteraction 
                    blog={blog} 
                    isLikedByUser={isLikedByUser} 
                    setIsLikedByUser={setIsLikedByUser}
                    commentsWrapper={commentsWrapper}
                    setCommentsWrapper={setCommentsWrapper}
                />

                {commentsWrapper && (
                    <div className="mt-8">
                        <Comments blogId={blog._id} />
                    </div>
                )}

                {similarBlogs && similarBlogs.length > 0 && (
                    <div className="mt-14">
                        <h1 className="text-2xl font-gelasio mb-10">Similar Blogs</h1>
                        <div className="space-y-6">
                            {similarBlogs.map((similarBlog, i) => (
                                <div key={i} className="bg-grey p-6 rounded-md">
                                    <h2 className="text-xl font-gelasio mb-2">{similarBlog.title}</h2>
                                    <p className="text-dark-grey mb-2">{similarBlog.des}</p>
                                    <div className="flex gap-4 text-sm text-dark-grey">
                                        <span>Likes: {similarBlog.activity.total_likes}</span>
                                        <span>Reads: {similarBlog.activity.total_reads}</span>
                                        <span>Comments: {similarBlog.activity.total_comments}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogContent;
