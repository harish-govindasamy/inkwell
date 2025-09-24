import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../App";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { Toaster, toast } from "react-hot-toast";
import BlogContent from "./blog-content.component";

const BlogPost = () => {
    const { blog_id } = useParams();
    const { userAuth: { access_token } } = useContext(UserContext);
    const [blog, setBlog] = useState(null);
    const [author, setAuthor] = useState(null);
    const [isLikedByUser, setIsLikedByUser] = useState(false);
    const [commentsWrapper, setCommentsWrapper] = useState(false);

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
                setBlog(data.blog);
                setAuthor(data.blog.author);
                getBlogComments();
            }
        })
        .catch(err => {
            toast.error("Error occurred while fetching blog");
        });
    };

    const getBlogComments = () => {
        fetch(import.meta.env.VITE_SERVER_DOMAIN + `/get-blog-comments?blog_id=${blog_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(p => p.json())
        .then(data => {
            if (data.comments) {
                // Comments loaded
            }
        })
        .catch(err => {
            console.log("Error fetching comments");
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
                <BlogContent 
                    blog={blog}
                    author={author}
                    isLikedByUser={isLikedByUser}
                    setIsLikedByUser={setIsLikedByUser}
                    commentsWrapper={commentsWrapper}
                    setCommentsWrapper={setCommentsWrapper}
                />
            )}
        </AnimationWrapper>
    );
};

export default BlogPost;
