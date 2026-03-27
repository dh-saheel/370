const router = require("express").Router();
const { getProfessors, addProfessor } = require("../controllers/ProfessorController");

router.get("/", getProfessors);
router.post("/", addProfessor);

module.exports = router;
