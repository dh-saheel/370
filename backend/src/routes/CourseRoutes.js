const router = require("express").Router();
const { getCourses, addCourse, getCourseById, getReviewedCourses } = require("../controllers/CourseController");

router.get("/", getCourses);
router.get("/reviewed", getReviewedCourses);
router.get("/:courseId", getCourseById);
router.post("/", addCourse);

module.exports = router;