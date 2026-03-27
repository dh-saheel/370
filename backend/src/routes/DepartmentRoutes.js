const router = require("express").Router();
const { getDepartments, addDepartment } = require("../controllers/DepartmentController");

router.get("/", getDepartments);
router.post("/", addDepartment);

module.exports = router;