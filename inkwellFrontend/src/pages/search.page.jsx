import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UserContext } from "../App";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import NoData from "../components/nodata.component";
import { Toaster, toast } from "react-hot-toast";
import BlogCard from "../components/blog-card.component";
import UserCard from "../components/usercard.component";

const SearchPage = () => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const [searchParams] = useSearchParams();
    const [blogs, setBlogs] = useState(null);
    const [users, setUsers] = useState(null);
    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState("blogs");

    useEffect(() => {
        let searchQuery = searchParams.get("q");
        if (searchQuery) {
            setQuery(searchQuery);
            searchBlogs(searchQuery);
            searchUsers(searchQuery);
        }
    }, [searchParams]);

    const searchBlogs = (searchQuery) => {
        fetch(import.meta.env.VITE_SERVER_DOMAIN + `/search-blogs?query=${searchQuery}`, {
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
            toast.error("Error occurred while searching blogs");
        });
    };

    const searchUsers = (searchQuery) => {
        fetch(import.meta.env.VITE_SERVER_DOMAIN + `/search-users?query=${searchQuery}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(p => p.json())
        .then(data => {
            if (data.users) {
                setUsers(data.users);
            }
        })
        .catch(err => {
            toast.error("Error occurred while searching users");
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            searchBlogs(query);
            searchUsers(query);
        }
    };

    return (
        <AnimationWrapper>
            <Toaster />
            <section className="h-cover flex justify-center gap-10 mt-12">
                <div className="max-w-[650px] w-full">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-grey p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <button
                            type="submit"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2"
                        >
                            <i className="fi fi-rr-search"></i>
                        </button>
                    </form>

                    <div className="flex gap-4 mt-8">
                        <button
                            className={`py-2 px-4 rounded-md ${activeTab === "blogs" ? "bg-black text-white" : "bg-grey"}`}
                            onClick={() => setActiveTab("blogs")}
                        >
                            Blogs
                        </button>
                        <button
                            className={`py-2 px-4 rounded-md ${activeTab === "users" ? "bg-black text-white" : "bg-grey"}`}
                            onClick={() => setActiveTab("users")}
                        >
                            Users
                        </button>
                    </div>

                    {activeTab === "blogs" ? (
                        <div className="mt-8">
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
                                <NoData message="No blogs found" />
                            )}
                        </div>
                    ) : (
                        <div className="mt-8">
                            {users === null ? (
                                <Loader />
                            ) : users.length ? (
                                users.map((user, i) => {
                                    return (
                                        <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }}>
                                            <UserCard user={user} />
                                        </AnimationWrapper>
                                    );
                                })
                            ) : (
                                <NoData message="No users found" />
                            )}
                        </div>
                    )}
                </div>
            </section>
        </AnimationWrapper>
    );
};

export default SearchPage;
