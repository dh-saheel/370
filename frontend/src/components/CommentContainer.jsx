import { useState, useEffect } from "react";
import CommentCard from "./CommentCard";
import PostComment from "./PostComment";

const CommentContainer = ( {reviewId} ) => {
    const [ comments, setComments ] = useState([]);

    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}/comments`);
                if (res.ok) {
                    const data = await res.json();
                    console.log(data);
                    setComments(data);
                }
            } catch (err) {
                console.error("Error fetching comments:", err);
            }
        };
        fetchComments();
    }, [reviewId]);

    return (
        <div className="flex flex-col">
            {/* comment form here textbox IF user is signed in,
            else display a message to sign up or sign in to post a message */}
            {/* still render comments, does not matter if they are signed in or not */}
            {isLoggedIn
                ? <PostComment reviewId={reviewId} token={token} onCommentPosted={(newComment) => setComments(prev => [...prev, newComment])} />
                : <p className="text-sm text-gray-400">Please sign in to post a comment.</p>
            }
            <div className="flex flex-col overflow-y-auto max-h-64">
                {comments.map(comment => (
                    <CommentCard 
                        key={comment.id} 
                        username={comment.username}
                        content={comment.content}
                        createdAt={comment.created_at}
                    />
                ))}
            </div>
        </div>
    );
}

export default CommentContainer;