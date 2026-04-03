const db = require("../config/db");

const findByDepartment = async (departmentId) => {
    const result = await db.query(
        "SELECT * FROM courses WHERE department_id = $1 ORDER BY name",
        [departmentId]
    );
    return result.rows;
};

const create = async (name, code, departmentId, institutionId) => {
    const result = await db.query(
        "INSERT INTO courses (name, code, department_id, institution_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, code, departmentId, institutionId]
    );
    return result.rows[0];
};

/**
 * Finds one course by id and joins department + institution names
 * This is being used by CreatePost.jsx and CourseReviewPage.jsx to render correct course details
 */
const findById = async (courseID) => {
    const result = await db.query(
        `SELECT
            c.id,
            c.name,
            c.code,
            c.department_id,
            c.institution_id,
            c.level,
            d.name AS department_name,
            i.name AS institution_name,
            ROUND(AVG(r.rating)::numeric, 1) AS average_rating,
            ARRAY_AGG(DISTINCT p.name ORDER BY p.name) FILTER (WHERE p.name IS NOT NULL) AS professors
        FROM courses c
        LEFT JOIN reviews r ON c.id = r.course_id
        LEFT JOIN departments d ON c.department_id = d.id
        LEFT JOIN institutions i ON c.institution_id = i.id
        LEFT JOIN course_professors cp ON c.id = cp.course_id
        LEFT JOIN professors p ON cp.professor_id = p.id
        WHERE c.id = $1
        GROUP BY c.id, c.name, c.code, c.department_id, c.institution_id, c.level, d.name, i.name`,
        [courseID]
    );
    return result.rows[0]
}; 

/**
 * Returns all courses that currently have a review on 
 */
const findReviewedCourses = async () => {
    const result = await db.query(
        `SELECT
            c.id,
            c.name,
            c.code,
            d.name AS department_name,
            i.name AS institution_name,
            COUNT(r.id) AS review_count,
            ROUND(AVG(r.rating)::numeric, 1) AS average_rating
        FROM courses c
        INNER JOIN reviews r ON c.id = r.course_id
        LEFT JOIN departments d ON c.department_id = d.id
        LEFT JOIN institutions i ON c.institution_id = i.id
        GROUP BY c.id, c.name, c.code, d.name, i.name
        ORDER BY c.code ASC`
    );
    return result.rows;
};



module.exports = { findByDepartment, create, findById, findReviewedCourses };
