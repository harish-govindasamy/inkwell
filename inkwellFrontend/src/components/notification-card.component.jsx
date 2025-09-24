import { useContext } from "react";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { formatDate } from "../common/date";

const NotificationCard = ({ notification, index }) => {
    const { userAuth: { access_token } } = useContext(UserContext);

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

    const markAsRead = () => {
        fetch(import.meta.env.VITE_SERVER_DOMAIN + "/mark-notification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body: JSON.stringify({ notificationId: notification._id })
        })
        .then(p => p.json())
        .then(data => {
            if (data.status === "Notification marked as read") {
                // Update UI to show as read
                notification.seen = true;
            }
        })
        .catch(err => {
            toast.error("Error marking notification as read");
        });
    };

    return (
        <div
            className={`bg-grey p-6 rounded-md cursor-pointer ${
                notification.seen ? "opacity-50" : "border-l-4 border-black"
            }`}
            onClick={markAsRead}
        >
            <div className="flex items-start gap-4">
                <img
                    src={notification.user.personal_info.profile_img}
                    className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                    <p className="text-lg">{getNotificationMessage(notification)}</p>
                    <p className="text-sm text-dark-grey mt-2">
                        {formatDate(notification.createdAt)}
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
    );
};

export default NotificationCard;
