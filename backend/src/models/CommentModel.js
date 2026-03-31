const db = require("../config/db");

const insertComment = async (userId, reviewId, content) => {
    const result = await db.query(
        `
        INSERT INTO comments (user_id, review_id, content)
        VALUES ($1, $2, $3)
        RETURNING id, user_id, review_id, content, created_at
        `,
        [userId, reviewId, content]
    );
    return result.rows[0];
};

const getComments = async (reviewId) => {
    const result = await db.query(
        `
        SELECT c.id, c.user_id, c.content, c.created_at, u.username
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.review_id = $1
        ORDER BY c.created_at ASC
        `,
        [reviewId]
    );
    return result.rows;
};

module.exports = { insertComment, getComments };