const CourseModel = require("../models/CourseModel");

const getCourses = async (req, res) => {
    const { departmentId } = req.query;
    const courses = await CourseModel.findByDepartment(departmentId);
    res.status(200).json(courses);
};

const addCourse = async (req, res) => {
    const { name, code, departmentId, institutionId } = req.body;
    const newCourse = await CourseModel.create(name, code, departmentId, institutionId);
    res.status(201).json(newCourse);
};

/**
 * Returns one course by id with department and institution name to display
 */
const getCourseById = async (req, res) => {
    const { courseId } = req.params;
    const course = await CourseModel.findById(courseId);

    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
}

/**
 * Returns all courses that currently have reviews
 */
const getReviewedCourses = async (req, res) => {
    const courses = await CourseModel.findReviewedCourses();
    res.status(200).json(courses);
};

module.exports = { getCourses, addCourse, getCourseById, getReviewedCourses };