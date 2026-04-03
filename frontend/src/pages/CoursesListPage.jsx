import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CoursesListPage() {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    async function getCourses() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/reviewed`);
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.log("Error fetching courses:", error);
        }
    }

    useEffect(() => {
        getCourses();
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-10 py-10 font-mono">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Reviewed Courses</h1>

            {courses.length === 0 && (
                <p className="text-gray-500">No courses with reviews yet.</p>
            )}

            {courses.map(course => (
                <div
                    key={course.id}
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="border border-gray-200 rounded-lg p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow bg-white"
                >
                    <strong className="text-gray-800">{course.code} - {course.name}</strong>
                    <p className="text-sm text-gray-500 mt-1">{course.department_name}</p>
                    <p className="text-sm text-gray-500">{course.institution_name}</p>
                    <p className="text-sm text-yellow-500 mt-1">{course.average_rating || 0} ★</p>
                </div>
            ))}
        </div>
    );
}


