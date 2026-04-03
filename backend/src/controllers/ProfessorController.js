const ProfessorModel = require("../models/ProfessorModel");

const getProfessors = async (req, res) => {
    try {
        const { departmentId } = req.query;
        const professors = await ProfessorModel.findByDepartment(departmentId);
        res.json(professors);
    } catch (err) {
        console.error('Error fetching professors:', err);
        res.status(500).json({ message: 'Failed to fetch professors' });
    }
};

// add a professor based on the CURRENT department and institution selected in the frontend
const addProfessor = async (req, res) => {
    try {
        const { name, departmentId, institutionId, courseId } = req.body;
        const newProfessor = await ProfessorModel.create(name, departmentId, institutionId);
        if (courseId) {
            await ProfessorModel.linkToCourse(newProfessor.id, courseId);
        }
        res.status(201).json(newProfessor);
    } catch (err) {
        console.error('Error adding professor:', err);
        res.status(500).json({ message: 'Failed to add professor' });
    }
};

module.exports = { getProfessors, addProfessor };
