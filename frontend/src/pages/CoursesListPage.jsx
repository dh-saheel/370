/* React references: 
*                    https://react.dev/reference/react
*                    https://www.w3schools.com/react/react_jsx.asp 
*
*  Tailwind references:
*                    https://tailwindcss.com/docs/installation/using-vite
*
*  Extra references:
*                    https://stackoverflow.com/questions
*
*  Persona 4 User Story: 1                                          
*/


/* Imports react tools */
import React, { useEffect, useState } from "react";

/* Imports navigation */
import { useNavigate } from "react-router-dom";

export default function CoursesListPage(){
    
    /* Stores the list of courses form the backend */
    const [courses, setCourses] = useState([]);

    /* Allows to navigate to another page */
    const navigate = useNavigate();

    /**
     * Gets all courses that have reviews from the backend
     */
    async function getCourses() {

        try {
            /* Sends request to backend */
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/reviewed`);
            
            /* Convert response into JSON */
            const data = await response.json();

            /* Stores the courses in state */
            setCourses(data);

        } catch (error) {
            console.log("Error fetching courses:", error);
        }
    }

    /* Fetches the data when the page opens */
    useEffect(() => {
        getCourses();
    }, []);


    return (
        <div style={{
            padding: "40px",
            fontFamily: "monospace" }}>
            
            {/* Page Title */}
            <h1>Reviewed Courses</h1>
            
            {/* Checks if there are no courses with review */}
            {courses.length === 0 && (
                <p> No courses with reviews yet. </p>
            )}

            {/* Loop through each course */}
            {courses.map(function(course) {
                return (
                    <div
                        key={course.id}

                        /* Box Style */
                        style={{
                            border: "1px solid black",
                            padding: "15px",
                            marginBottom: "15px",
                            cursor: "pointer"
                        }}

                        onClick={() => navigate(`/courses/${course.id}`)}
                    >
                        {/* Course Code and Name */}
                        <strong> {course.code} - {course.name} </strong>

                        {/* Department */}
                        <p>{course.department_name}</p>

                        {/* Institution */}
                        <p>{course.institution_name}</p>

                        {/* Rating */}
                        <p> Rating: {course.average_rating || 0} ★</p>

                    </div>
                );
            })}
        </div>
    );
}


