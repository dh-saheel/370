const DepartmentModel = require("../models/DepartmentModel");

const getDepartments = async (req, res) => {
    const { institutionId } = req.query;
    const departments = await DepartmentModel.findByInstitution(institutionId);
    res.json(departments);
};

// add a department based on the CURRENT institution selected in the frontend
const addDepartment = async (req, res) => {
    const { name, institutionId } = req.body;
    const newDepartment = await DepartmentModel.create(name, institutionId);
    res.status(201).json(newDepartment);    
};


module.exports = { getDepartments, addDepartment };