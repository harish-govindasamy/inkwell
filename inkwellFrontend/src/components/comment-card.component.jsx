import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import { formatDate } from "../common/date";

const CommentCard = ({ comment, index, leftMargin = 0 }) => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const [isReplying, setIsReplying] = useState(false);
    const [showReplies, setShowReplies] = useState(false);

    const handleDeleteComment = () => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            fetch(import.meta.env.VITE_SERVER_DOMAIN + "/delete-comment", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                },
                body: JSON.stringify({ _id: comment._id })
            })
            .then(p => p.json())
            .then(data => {
                if (data.status === "Done") {
                    toast.success("Comment deleted");
                    window.location.reload();
                } else {
                    toast.error("Error deleting comment");
                }
            })
            .catch(err => {
                toast.error("Error deleting comment");
            });
        }
    };

    return (
        <div className="flex gap-4 my-4" style={{ marginLeft: leftMargin }}>
            <img 
                src={comment.commented_by.personal_info.profile_img} 
                className="w-10 h-10 rounded-full" 
            />
            <div className="flex-1">
                <div className="flex gap-2 items-center mb-2">
                    <h3 className="font-medium">{comment.commented_by.personal_info.username}</h3>
                    <p className="text-dark-grey text-sm">{formatDate(comment.commentedAt)}</p>
                </div>
                <p className="text-lg leading-7">{comment.comment}</p>
                
                <div className="flex gap-4 mt-2">
                    <button 
                        className="text-dark-grey hover:text-black"
                        onClick={() => setIsReplying(!isReplying)}
                    >
                        Reply
                    </button>
                    {comment.children && comment.children.length > 0 && (
                        <button 
                            className="text-dark-grey hover:text-black"
                            onClick={() => setShowReplies(!showReplies)}
                        >
                            {showReplies ? "Hide" : "Show"} {comment.children.length} replies
                        </button>
                    )}
                    {access_token && (
                        <button 
                            className="text-red-500 hover:text-red-700"
                            onClick={handleDeleteComment}
                        >
                            Delete
                        </button>
                    )}
                </div>

                {isReplying && (
                    <CommentField 
                        blogId={comment.blog_id}
                        replyingTo={comment._id}
                        setReplying={setIsReplying}
                    />
                )}

                {showReplies && comment.children && comment.children.length > 0 && (
                    <div className="mt-4">
                        {comment.children.map((reply, i) => (
                            <CommentCard 
                                key={i} 
                                comment={reply} 
                                index={i} 
                                leftMargin={20}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentCard;
