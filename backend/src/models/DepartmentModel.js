const db = require("../config/db");

// takes an institution id and returns a list of departments associated with that institution
const findByInstitution = async (institutionId) => {
    const result = await db.query(
        "SELECT * FROM departments WHERE institution_id = $1 ORDER BY name",
        [institutionId]
    );
    return result.rows;
};

// creates a new department in the database and returns the created department
const create = async (name, institutionId) => {
    const result = await db.query(
        "INSERT INTO departments (name, institution_id) VALUES ($1, $2) RETURNING *",
        [name, institutionId]
    );
    return result.rows[0];
}

module.exports = { findByInstitution, create };