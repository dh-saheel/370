const usersAndCourse = "text-white bg-gray-500 rounded-lg p-2";
const textTitle = "text-md font-bold text-gray-900 mb-1";

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
        <div className={`bg-gray-200 rounded-xl p-2`}>
            <div className={`bg-red-100 border-b rounded-xl border-red-100 p-4`}>
                {/* Hold user that made report and amount of flags*/}
                <div className="flex justify-between">
                    <p className="italic">Report made by: {userName || "No user."}</p>
                    <div className="bg-red-200 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Flag Count: {flagCount || "1"}</div>
                </div>
                <p className="italic">Reason: {reason || "No reason."}</p>
            </div>
            <div className={`bg-white rounded-xl p-2 mb-2`}>
                {/* Holds the user, course, and professor information.*/}
                <div className={`flex gap-4 mb-2`}>
                    <span className={usersAndCourse}>{postUserName || "No user."}</span>
                    <span className={usersAndCourse}>{courseName || "No course."}</span>
                    <span className={usersAndCourse}>{professorName || "No professor."}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
                    {/* Holds the main content of a review.*/}
                    <div>
                        <h2 className={textTitle}>{title}</h2>
                        <p>{content || "No content."}</p>
                    </div>
                    {/* Holds the assignment review content. */}
                    <div className={``}>
                        <h3 className={textTitle}>Assignments</h3>
                        <p>{assignments || "No content."}</p>
                    </div>
                    {/* Holds the exam review content. */}
                    <div className={``}>
                        <h3 className={textTitle}>Exams</h3>
                        <p>{exams || "No content."}</p>
                    </div>
                    {/* Holds the lab review content. */}
                    <div className={``}>
                        <h3 className={textTitle}>Labs</h3>
                        <p>{labs || "No content."}</p>
                    </div>
                </div>
                <small>Review Time: {postCreatedAt || "No time."}</small>
            </div>
            <small>Report Time: {createdAt || "No time."}</small>
            <div className="flex justify-between py-2 px-2">
                <button 
                    onClick={() => onAction(reviewId, actions.KEEP)} 
                    className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-500"
                    >Keep Review
                </button>
                <div className="flex justify-between gap-4">
                    {!isBanned && (<button 
                        onClick={() => onAction(postUserId, actions.BAN)} 
                        className="bg-black text-white p-2 rounded-lg hover:bg-gray-500"
                        >Ban User
                    </button>)}
                    <button 
                        onClick={() => onAction(reviewId, actions.DELETE)} 
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-300"
                        >Delete Review
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminPost