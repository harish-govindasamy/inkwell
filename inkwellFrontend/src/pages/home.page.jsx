import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import NoData from "../components/nodata.component";
import { Toaster, toast } from "react-hot-toast";
import BlogCard from "../components/blog-card.component";
import TrendingBlogCard from "../components/trending-blog-card.component";
import LoadMore from "../components/load-more.component";

const Home = () => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const [blogs, setBlogs] = useState(null);
    const [trendingBlogs, setTrendingBlogs] = useState(null);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const getLatestBlogs = ({ page = 1 }) => {
        fetch(import.meta.env.VITE_SERVER_DOMAIN + `/latest-blogs?page=${page}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(p => p.json())
        .then(data => {
            if (data.blogs) {
                if (page === 1) {
                    setBlogs(data.blogs);
                } else {
                    setBlogs(currentVal => {
                        return [...currentVal, ...data.blogs];
                    });
                }
                setTotalCount(data.totalCount || 0);
            }
        })
        .catch(err => {
            toast.error("Error occurred while fetching blogs");
        });
    };

    const getTrendingBlogs = () => {
        fetch(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(p => p.json())
        .then(data => {
            if (data.blogs) {
                setTrendingBlogs(data.blogs);
            }
        })
        .catch(err => {
            toast.error("Error occurred while fetching trending blogs");
        });
    };

    useEffect(() => {
        getLatestBlogs({ page: 1 });
        getTrendingBlogs();
    }, []);

    const handleLoadMore = () => {
        let newPage = page + 1;
        setPage(newPage);
        getLatestBlogs({ page: newPage });
    };

    return (
        <AnimationWrapper>
            <Toaster />
            <section className="h-cover flex justify-center gap-10 mt-12">
                <div className="max-w-[650px] w-full">
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
                    <LoadMore state={blogs} fetchData={handleLoadMore} />
                </div>

                <div className="min-w-[300px] max-md:hidden">
                    <div className="sticky top-[100px]">
                        <p className="text-xl font-ibm-plex-sans m-3 mb-4">Trending <i className="fi fi-rr-arrow-trend-up"></i></p>
                        {trendingBlogs === null ? (
                            <Loader />
                        ) : trendingBlogs.length ? (
                            trendingBlogs.map((blog, i) => {
                                return (
                                    <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }}>
                                        <TrendingBlogCard blog={blog} index={i} />
                                    </AnimationWrapper>
                                );
                            })
                        ) : (
                            <NoData message="No trending blogs" />
                        )}
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    );
};

export default Home;
