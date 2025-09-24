import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../App";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import NoData from "../components/nodata.component";
import { Toaster, toast } from "react-hot-toast";
import BlogCard from "../components/blog-card.component";

const ProfilePage = () => {
    const { user_id } = useParams();
    const { userAuth: { access_token } } = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [blogs, setBlogs] = useState(null);
    const [page, setPage] = useState(1);

    const getUser = () => {
        fetch(import.meta.env.VITE_SERVER_DOMAIN + `/get-user/${user_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(p => p.json())
        .then(data => {
            if (data.user) {
                setUser(data.user);
                getUserBlogs(data.user._id);
            }
        })
        .catch(err => {
            toast.error("Error occurred while fetching user");
        });
    };

    const getUserBlogs = (authorId) => {
        fetch(import.meta.env.VITE_SERVER_DOMAIN + `/search-blogs?author=${authorId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(p => p.json())
        .then(data => {
            if (data.blogs) {
                setBlogs(data.blogs);
            }
        })
        .catch(err => {
            toast.error("Error occurred while fetching user blogs");
        });
    };

    useEffect(() => {
        getUser();
    }, [user_id]);

    return (
        <AnimationWrapper>
            <Toaster />
            {user === null ? (
                <Loader />
            ) : (
                <section className="h-cover flex justify-center gap-10 mt-12">
                    <div className="max-w-[650px] w-full">
                        <div className="flex gap-4 items-center mb-8">
                            <img src={user.personal_info.profile_img} className="w-20 h-20 rounded-full" />
                            <div>
                                <h1 className="text-3xl font-gelasio">{user.personal_info.fullname}</h1>
                                <p className="text-dark-grey">@{user.personal_info.username}</p>
                                <p className="text-dark-grey mt-2">{user.personal_info.bio}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 mb-8">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{user.account_info.total_posts}</p>
                                <p className="text-dark-grey">Posts</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">{user.account_info.total_reads}</p>
                                <p className="text-dark-grey">Reads</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-gelasio mb-4">Blogs</h2>
                            {blogs === null ? (
                                <Loader />
                            ) : blogs.length ? (
                                blogs.map((blog, i) => {
                                    return (
                                        <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }}>
                                            <BlogCard content={blog} author={blog.author} />
                                        </AnimationWrapper>
                                    );
                                })
                            ) : (
                                <NoData message="No blogs published" />
                            )}
                        </div>
                    </div>
                </section>
            )}
        </AnimationWrapper>
    );
};

export default ProfilePage;
