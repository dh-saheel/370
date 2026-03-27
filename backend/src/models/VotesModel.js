const db = require("../config/db");

const insertVote = async (userId, reviewId, isLike) => {
    const result = await db.query(
        `
        INSERT INTO review_votes (user_id, review_id, is_like) 
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, review_id)
        DO UPDATE SET is_like =$3 
        `,
        [userId, reviewId, isLike]
    );
};

const deleteVote = async (userId, reviewId) => {
    const result = await db.query(
        "DELETE FROM review_votes WHERE user_id = $1 AND review_id = $2",
        [userId, reviewId]
    );
}

const getUserVote = async (reviewId, userId) => {
    const result = await db.query(
        `SELECT is_like FROM review_votes WHERE review_id = $1 AND user_id = $2`,
        [reviewId, userId]
    );
    return result.rows[0] || null;
};

module.exports = { insertVote, deleteVote, getUserVote };