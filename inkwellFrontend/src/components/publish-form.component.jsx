import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";

const PublishForm = () => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const publishFormRef = useRef();

    const handlePublish = (e) => {
        e.preventDefault();
        let form = new FormData(publishFormRef.current);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { title, banner, des, tags, content } = formData;

        if (!title.trim()) {
            return toast.error("You must provide a title to publish the blog");
        }

        if (!des.trim() || des.length > 200) {
            return toast.error("You must provide blog description under 200 characters");
        }

        if (!banner) {
            return toast.error("You must provide a banner to publish the blog");
        }

        if (!tags.trim()) {
            return toast.error("Enter at least one tag to help us categorize your blog");
        }

        if (!content.trim()) {
            return toast.error("Write some content to publish the blog");
        }

        let loadingToast = toast.loading("Publishing your blog...");

        fetch(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body: JSON.stringify({
                title,
                banner,
                des,
                tags: tags.split(",").map(tag => tag.trim()),
                content: JSON.parse(content),
                draft: false
            })
        })
        .then(p => p.json())
        .then(data => {
            if (data.blog_id) {
                toast.dismiss(loadingToast);
                toast.success("Published 👍");
                setTimeout(() => {
                    location.href = "/";
                }, 500);
            }
        })
        .catch(err => {
            toast.dismiss(loadingToast);
            toast.error("Error occurred while publishing");
        });
    };

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex-none w-10">
                    <img src={logo} />
                </Link>

                <p className="max-md:hidden text-black line-clamp-1 w-full">Publish</p>

                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2" onClick={handlePublish}>Publish</button>
                </div>
            </nav>

            <Toaster />
            <AnimationWrapper>
                <section className="w-full min-h-screen p-4 md:p-0">
                    <form ref={publishFormRef} className="max-w-[900px] mx-auto">
                        <h1 className="text-4xl font-gelasio capitalize text-center mb-24">Publish your blog</h1>

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <label className="text-lg font-medium">Blog Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="w-full bg-grey p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Enter blog title"
                                />
                            </div>

                            <div>
                                <label className="text-lg font-medium">Blog Banner</label>
                                <input
                                    type="url"
                                    name="banner"
                                    className="w-full bg-grey p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Enter banner URL"
                                />
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="text-lg font-medium">Blog Description</label>
                            <textarea
                                name="des"
                                className="w-full bg-grey p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black h-32 resize-none"
                                placeholder="Enter blog description"
                                maxLength="200"
                            ></textarea>
                            <p className="text-sm text-grey mt-2">0/200 characters</p>
                        </div>

                        <div className="mb-8">
                            <label className="text-lg font-medium">Tags</label>
                            <input
                                type="text"
                                name="tags"
                                className="w-full bg-grey p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Enter tags separated by commas"
                            />
                            <p className="text-sm text-grey mt-2">Separate tags with commas</p>
                        </div>

                        <div className="mb-8">
                            <label className="text-lg font-medium">Blog Content</label>
                            <textarea
                                name="content"
                                className="w-full bg-grey p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black h-64 resize-none"
                                placeholder="Enter blog content (JSON format)"
                            ></textarea>
                            <p className="text-sm text-grey mt-2">Enter the JSON content from EditorJS</p>
                        </div>
                    </form>
                </section>
            </AnimationWrapper>
        </>
    );
};

export default PublishForm;