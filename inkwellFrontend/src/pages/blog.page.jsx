import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../App";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { Toaster, toast } from "react-hot-toast";
import BlogContentRenderer from "../components/blog-content-renderer.component";
import BlogInteraction from "../components/blog-interaction.component";
import BlogCard from "../components/blog-card.component";
import Comments from "../components/comments.component";

const BlogPage = () => {
    const { blog_id } = useParams();
    const { userAuth: { access_token } } = useContext(UserContext);
    const [blog, setBlog] = useState(null);
    const [similarBlogs, setSimilarBlogs] = useState(null);
    const [isLikedByUser, setIsLikedByUser] = useState(false);
    const [commentsWrapper, setCommentsWrapper] = useState(false);
    const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

    const getBlog = () => {
        fetch(import.meta.env.VITE_SERVER_DOMAIN + `/get-blog/${blog_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(p => p.json())
        .then(data => {
            if (data.blog) {
                console.log('Blog data received:', data.blog);
                console.log('Author ID:', data.blog.author._id);
                setBlog(data.blog);
                getSimilarBlogs(data.blog.tags, data.blog.author._id);
                getBlogComments(data.blog._id);
            }
        })
        .catch(err => {
            toast.error("Error occurred while fetching blog");
        });
    };

    const getSimilarBlogs = (tags, authorId) => {
        console.log('getSimilarBlogs called with:', { tags, authorId });
        // Fetch similar blogs based on tags and exclude current author
        fetch(import.meta.env.VITE_SERVER_DOMAIN + `/search-blogs?tag=${tags[0]}&author=${authorId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(p => p.json())
        .then(data => {
            if (data.blogs) {
                setSimilarBlogs(data.blogs);
            }
        })
        .catch(err => {
            toast.error("Error occurred while fetching similar blogs");
        });
    };

    const getBlogComments = (blogObjectId) => {
        fetch(import.meta.env.VITE_SERVER_DOMAIN + `/get-blog-comments?blog_id=${blogObjectId}&skip=${totalParentCommentsLoaded}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(p => p.json())
        .then(data => {
            if (data.comments) {
                setTotalParentCommentsLoaded(currentVal => currentVal + data.comments.length);
            }
        })
        .catch(err => {
            toast.error("Error occurred while fetching comments");
        });
    };

    useEffect(() => {
        getBlog();
    }, [blog_id]);

    return (
        <AnimationWrapper>
            <Toaster />
            {blog === null ? (
                <Loader />
            ) : (
                <section className="max-w-[900px] center py-10 max-lg:px-[5vw]">
                    <div className="w-full">
                        <h1 className="text-4xl font-gelasio leading-tight">{blog.title}</h1>

                        <div className="flex gap-4 mt-4 mb-8">
                            <img src={blog.author.personal_info.profile_img} className="w-12 h-12 rounded-full" />
                            <div>
                                <p className="capitalize">{blog.author.personal_info.fullname}</p>
                                <p className="text-dark-grey">@{blog.author.personal_info.username}</p>
                            </div>
                            <p className="text-dark-grey ml-auto">{blog.publishedAt}</p>
                        </div>

                        <img src={blog.banner} className="aspect-video w-full" />

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

                        {similarBlogs && similarBlogs.length ? (
                            <div className="mt-14">
                                <h1 className="text-2xl font-gelasio mb-10">Similar Blogs</h1>
                                {similarBlogs.map((blog, i) => {
                                    return (
                                        <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }}>
                                            <BlogCard content={blog} author={blog.author} />
                                        </AnimationWrapper>
                                    );
                                })}
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </section>
            )}
        </AnimationWrapper>
    );
};

export default BlogPage;
