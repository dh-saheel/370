const db = require("../config/db");

const findById = async (userId) => {
    const result = await db.query(
        `SELECT id, username, email, created_at FROM users WHERE id = $1`,
        [userId]
    );
    return result.rows[0];
};

const findReviewsByUser = async (userId) => {
    const result = await db.query(
        `SELECT
            r.id,
            r.rating,
            r.title,
            r.content,
            r.created_at,
            c.id   AS course_id,
            c.name AS course_name,
            c.code AS course_code,
            p.name AS professor_name
        FROM reviews r
        JOIN courses c ON r.course_id = c.id
        JOIN professors p ON r.professor_id = p.id
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC`,
        [userId]
    );
    return result.rows;
};

const updatePassword = async (userId, hashedPassword) => {
    await db.query(
        `UPDATE users SET password_hash = $1 WHERE id = $2`,
        [hashedPassword, userId]
    );
};

const findByUsername = async (username) => {
    const result = await db.query(
        `SELECT id, username, isadmin FROM users WHERE username = $1`,
        [username]
    );
    return result.rows[0];
};

const setAdmin = async (userId, isAdmin) => {
    await db.query(
        `UPDATE users SET isAdmin = $1 WHERE id = $2`,
        [isAdmin, userId]
    );
};

module.exports = { findById, findReviewsByUser, updatePassword, findByUsername, setAdmin };
