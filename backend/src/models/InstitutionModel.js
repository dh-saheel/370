const db = require("../config/db");

// grabs all institutions in the database and returns them in an array
const findAll = async () => {
    const result = await db.query("SELECT * FROM institutions ORDER BY name");
    return result.rows;
};

// creates a new institution in the database and returns the created institution
const create = async (name) => {
    const result = await db.query(
        "INSERT INTO institutions (name) VALUES ($1) RETURNING *",
        [name]
    );
    return result.rows[0];
}

module.exports = { findAll, create };