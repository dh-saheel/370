const db = require("../config/db");

// returns all professors belonging to a given department
const findByDepartment = async (departmentId) => {
    const result = await db.query(
        "SELECT id, name FROM professors WHERE department_id = $1 ORDER BY name",
        [departmentId]
    );
    return result.rows;
};

// creates a new professor in the database and returns the created professor
const create = async (name, departmentId, institutionId) => {
    const result = await db.query(
        "INSERT INTO professors (name, department_id, institution_id) VALUES ($1, $2, $3) RETURNING id, name",
        [name, departmentId, institutionId]
    );
    return result.rows[0];
};

module.exports = { findByDepartment, create };
