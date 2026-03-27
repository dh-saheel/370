const InstitutionModel = require('../models/InstitutionModel');

// returns a json array of all institutions
const getAllInstitutions = async (req, res) => {
    const institutions = await InstitutionModel.findAll();
    res.json(institutions);
};

const createInstitution = async (req, res) => {
    const institution = await InstitutionModel.create(req.body.name);
    res.status(201).json(institution); // sends back the new created institution
};

module.exports = { getAllInstitutions, createInstitution };