import { useState } from "react";

const PostComment = ({ reviewId, token, onCommentPosted }) => {
    const [ content, setContent ] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}/comments`, 
                {
                    method: 'POST',
                    headers: { 
                        "Content-Type": 'application/json',
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ content })
                });
                const newComment = await res.json();
                const decoded = JSON.parse(atob(token.split('.')[1]));
                onCommentPosted({ 
                    ...newComment, 
                    username: decoded.username 
                }); 
                setContent(""); // Clear the textarea after successful submission
        } catch (err) {
            console.error("Error submitting comment:", err);
        };
    };

    return (
        <div className="flex flex-col gap-2 mb-4 mt-4">
            <textarea
                className="resize-none border border-gray-200 rounded-lg p-2 text-sm w-full"
                placeholder="Write a comment..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                maxLength={500}
            />
            <p className="text-xs text-gray-400 text-right">500 Max Characters</p>
            <p className="text-xs text-gray-400 text-right">{content.length}/500</p>
            <button type="submit" onClick={handleSubmit}
                className="self-start bg-[#7F77DD] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#6B63C9]">
                Post Comment
            </button>
        </div>
    );
}

export default PostComment;