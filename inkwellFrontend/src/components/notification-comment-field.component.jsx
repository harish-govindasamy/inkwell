import { useContext, useRef } from "react";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";

const NotificationCommentField = ({ blogId, replyingTo = null, setReplying = null }) => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const commentFieldRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!access_token) {
            return toast.error("Login to leave a comment");
        }

        let comment = commentFieldRef.current.value;
        if (!comment.length) {
            return toast.error("Write something to leave a comment");
        }

        let loadingToast = toast.loading("Posting comment...");

        fetch(import.meta.env.VITE_SERVER_DOMAIN + "/add-comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body: JSON.stringify({
                _id: blogId,
                comment,
                replying_to: replyingTo
            })
        })
        .then(p => p.json())
        .then(data => {
            if (data.comment) {
                toast.dismiss(loadingToast);
                toast.success("Comment posted");
                commentFieldRef.current.value = "";
                if (setReplying) {
                    setReplying(false);
                }
                window.location.reload();
            } else {
                toast.dismiss(loadingToast);
                toast.error("Error posting comment");
            }
        })
        .catch(err => {
            toast.dismiss(loadingToast);
            toast.error("Error posting comment");
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <textarea
                ref={commentFieldRef}
                placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
                className="w-full bg-grey p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none h-20"
            />
            <div className="flex gap-4 mt-2">
                <button
                    type="submit"
                    className="btn-dark py-2 px-4"
                >
                    {replyingTo ? "Reply" : "Comment"}
                </button>
                {setReplying && (
                    <button
                        type="button"
                        onClick={() => setReplying(false)}
                        className="btn-light py-2 px-4"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default NotificationCommentField;
