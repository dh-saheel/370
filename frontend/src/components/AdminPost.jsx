const borderStyle = "border border-black"

const AdminPost = ({ 
        reviewId,
        actions,
        onAction,
        isBanned, 
        userName, 
        flagCount, 
        reason, 
        postUserId, 
        postUserName,
        courseName, 
        professorName, 
        title, 
        content, 
        assignments, 
        exams, 
        labs, 
        postCreatedAt, 
        createdAt 
    }) => {
        
    return (
        <div className={`bg-gray-200 ${borderStyle}`}>
            <div className={`bg-gray-200 ${borderStyle}`}>
                {/* Hold user that made report and amount of flags*/}
                <div className="flex justify-between">
                    <p>Report made by: {userName || "No user."}</p>
                    <p>Flag Count {flagCount || "1"}</p>
                </div>
                <p>{reason || "No reason."}</p>
            </div>
            <div className={`bg-gray-200 ${borderStyle}`}>
                {/* Holds the user, course, and professor information.*/}
                <div className={`flex gap-4 ${borderStyle}`}>
                    <span>{postUserName || "No user."}</span>
                    <span>{courseName || "No course."}</span>
                    <span>{professorName || "No professor."}</span>
                </div>
                {/* Holds the main content of a review.*/}
                <div className={`${borderStyle}`}>
                    <h2>{title}</h2>
                    <p>{content || "No content."}</p>
                </div>
                {/* Holds the assignment review content. */}
                <div className={`${borderStyle}`}>
                    <h3>Assignments</h3>
                    <p>{assignments || "No content."}</p>
                </div>
                {/* Holds the exam review content. */}
                <div className={`${borderStyle}`}>
                    <h3>Exams</h3>
                    <p>{exams || "No content."}</p>
                </div>
                {/* Holds the lab review content. */}
                <div className={`${borderStyle}`}>
                    <h3>Labs</h3>
                    <p>{labs || "No content."}</p>
                </div>
                <small>{postCreatedAt || "No time."}</small>
            </div>
            <small>{createdAt || "No time."}</small>
            <div className="flex justify-between py-2 px-4">
                <button 
                    onClick={() => onAction(reviewId, actions.KEEP)} 
                    className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-500"
                    >Keep Review
                </button>
                <div className="flex justify-between gap-4">
                    {!isBanned && (<button 
                        onClick={() => onAction(postUserId, actions.BAN)} 
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-500"
                        >Ban User
                    </button>)}
                    <button 
                        onClick={() => onAction(reviewId, actions.DELETE)} 
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-500"
                        >Delete Review
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminPost