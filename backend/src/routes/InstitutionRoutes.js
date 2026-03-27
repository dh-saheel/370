const router = require("express").Router();
const { getAllInstitutions, createInstitution } = require("../controllers/InstitutionController");

router.get("/", getAllInstitutions);
router.post("/", createInstitution);

module.exports = router;