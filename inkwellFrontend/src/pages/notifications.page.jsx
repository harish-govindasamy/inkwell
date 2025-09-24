import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import NoData from "../components/nodata.component";
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const Notifications = () => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const [notifications, setNotifications] = useState(null);
    const [activeTab, setActiveTab] = useState("all");

    const getNotifications = () => {
        fetch(import.meta.env.VITE_SERVER_DOMAIN + `/notifications?type=${activeTab}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            }
        })
        .then(p => p.json())
        .then(data => {
            if (data.notifications) {
                setNotifications(data.notifications);
            }
        })
        .catch(err => {
            toast.error("Error occurred while fetching notifications");
        });
    };

    const markAsRead = (notificationId) => {
        fetch(import.meta.env.VITE_SERVER_DOMAIN + "/mark-notification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body: JSON.stringify({ notificationId })
        })
        .then(p => p.json())
        .then(data => {
            if (data.status === "Notification marked as read") {
                getNotifications();
            }
        })
        .catch(err => {
            toast.error("Error marking notification as read");
        });
    };

    useEffect(() => {
        getNotifications();
    }, [activeTab]);

    const getNotificationMessage = (notification) => {
        switch (notification.type) {
            case "like":
                return `${notification.user.personal_info.fullname} liked your blog "${notification.blog.title}"`;
            case "comment":
                return `${notification.user.personal_info.fullname} commented on your blog "${notification.blog.title}"`;
            case "reply":
                return `${notification.user.personal_info.fullname} replied to your comment on "${notification.blog.title}"`;
            default:
                return "New notification";
        }
    };

    return (
        <AnimationWrapper>
            <Toaster />
            <section className="h-cover flex justify-center gap-10 mt-12">
                <div className="max-w-[900px] w-full">
                    <h1 className="text-4xl font-gelasio mb-8">Notifications</h1>

                    <div className="flex gap-4 mb-8">
                        <button
                            className={`py-2 px-4 rounded-md ${activeTab === "all" ? "bg-black text-white" : "bg-grey"}`}
                            onClick={() => setActiveTab("all")}
                        >
                            All
                        </button>
                        <button
                            className={`py-2 px-4 rounded-md ${activeTab === "like" ? "bg-black text-white" : "bg-grey"}`}
                            onClick={() => setActiveTab("like")}
                        >
                            Likes
                        </button>
                        <button
                            className={`py-2 px-4 rounded-md ${activeTab === "comment" ? "bg-black text-white" : "bg-grey"}`}
                            onClick={() => setActiveTab("comment")}
                        >
                            Comments
                        </button>
                        <button
                            className={`py-2 px-4 rounded-md ${activeTab === "reply" ? "bg-black text-white" : "bg-grey"}`}
                            onClick={() => setActiveTab("reply")}
                        >
                            Replies
                        </button>
                    </div>

                    {notifications === null ? (
                        <Loader />
                    ) : notifications.length ? (
                        <div className="space-y-4">
                            {notifications.map((notification, i) => (
                                <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }}>
                                    <div
                                        className={`bg-grey p-6 rounded-md cursor-pointer ${
                                            notification.seen ? "opacity-50" : "border-l-4 border-black"
                                        }`}
                                        onClick={() => markAsRead(notification._id)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={notification.user.personal_info.profile_img}
                                                className="w-12 h-12 rounded-full"
                                            />
                                            <div className="flex-1">
                                                <p className="text-lg">{getNotificationMessage(notification)}</p>
                                                <p className="text-sm text-dark-grey mt-2">
                                                    {new Date(notification.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Link
                                                to={`/blog/${notification.blog.blog_id}`}
                                                className="btn-light py-2 px-4"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                </AnimationWrapper>
                            ))}
                        </div>
                    ) : (
                        <NoData message="No notifications" />
                    )}
                </div>
            </section>
        </AnimationWrapper>
    );
};

export default Notifications;
