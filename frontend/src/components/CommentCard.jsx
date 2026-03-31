const CommentCard = ({ username, content, createdAt }) => {
    return (
        <div className="flex flex-col gap-2 p-4 border rounded-lg bg-white mb-3">
            <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-400 mt-2 mb-3">
                    {username} &middot; {new Date(createdAt).toLocaleDateString()}
                </p>
            </div>
            <p className="text-sm break-words">{content}</p>
        </div>
    ); 
};

export default CommentCard;