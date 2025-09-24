import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { Toaster, toast } from "react-hot-toast";

const Dashboard = () => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const [user, setUser] = useState(null);

    const getUser = () => {
        fetch(import.meta.env.VITE_SERVER_DOMAIN + "/get-user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            }
        })
        .then(p => p.json())
        .then(data => {
            if (data.user) {
                setUser(data.user);
            }
        })
        .catch(err => {
            toast.error("Error occurred while fetching user data");
        });
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <AnimationWrapper>
            <Toaster />
            {user === null ? (
                <Loader />
            ) : (
                <section className="h-cover flex justify-center gap-10 mt-12">
                    <div className="max-w-[650px] w-full">
                        <h1 className="text-4xl font-gelasio mb-8">Dashboard</h1>

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-grey p-6 rounded-md">
                                <h2 className="text-2xl font-gelasio mb-4">Quick Actions</h2>
                                <div className="space-y-4">
                                    <Link to="/editor" className="btn-dark w-full text-center block">
                                        Write New Blog
                                    </Link>
                                    <Link to="/manage-blogs" className="btn-light w-full text-center block">
                                        Manage Blogs
                                    </Link>
                                    <Link to="/notifications" className="btn-light w-full text-center block">
                                        Notifications
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-grey p-6 rounded-md">
                                <h2 className="text-2xl font-gelasio mb-4">Account Settings</h2>
                                <div className="space-y-4">
                                    <Link to="/edit-profile" className="btn-light w-full text-center block">
                                        Edit Profile
                                    </Link>
                                    <Link to="/change-password" className="btn-light w-full text-center block">
                                        Change Password
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="bg-grey p-6 rounded-md">
                            <h2 className="text-2xl font-gelasio mb-4">Account Stats</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <p className="text-3xl font-bold">{user.account_info.total_posts}</p>
                                    <p className="text-dark-grey">Total Posts</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold">{user.account_info.total_reads}</p>
                                    <p className="text-dark-grey">Total Reads</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold">0</p>
                                    <p className="text-dark-grey">Followers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </AnimationWrapper>
    );
};

export default Dashboard;
