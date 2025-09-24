import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import CommentCard from "./comment-card.component";
import CommentField from "./comment-field.component";

const Comments = ({ blogId }) => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const [comments, setComments] = useState(null);
    const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

    const getBlogComments = () => {
        fetch(import.meta.env.VITE_SERVER_DOMAIN + `/get-blog-comments?blog_id=${blogId}&skip=${totalParentCommentsLoaded}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(p => p.json())
        .then(data => {
            if (data.comments) {
                if (totalParentCommentsLoaded === 0) {
                    setComments(data.comments);
                } else {
                    setComments(currentVal => [...currentVal, ...data.comments]);
                }
                setTotalParentCommentsLoaded(currentVal => currentVal + data.comments.length);
            }
        })
        .catch(err => {
            toast.error("Error occurred while fetching comments");
        });
    };

    useEffect(() => {
        getBlogComments();
    }, [blogId]);

    return (
        <div className="max-w-[700px]">
            <div className="flex gap-4 items-center mb-8">
                <h1 className="text-2xl font-gelasio">Comments</h1>
                <p className="text-dark-grey">({comments?.length || 0})</p>
            </div>

            {access_token ? (
                <CommentField blogId={blogId} />
            ) : (
                <div className="text-center py-8">
                    <p className="text-dark-grey mb-4">Login to leave a comment</p>
                    <a href="/signin" className="btn-dark">
                        Login
                    </a>
                </div>
            )}

            <div className="mt-8">
                {comments === null ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                    </div>
                ) : comments.length ? (
                    comments.map((comment, i) => (
                        <CommentCard key={i} comment={comment} index={i} />
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-dark-grey">No comments yet</p>
                    </div>
                )}
            </div>

            {comments && comments.length > 0 && (
                <button
                    className="btn-light w-full mt-4"
                    onClick={getBlogComments}
                >
                    Load More Comments
                </button>
            )}
        </div>
    );
};

export default Comments;
