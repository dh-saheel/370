import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectCard from "../components/SelectCard"

const FindReview = () => {
    const navigate = useNavigate();

    const [institutions, setInstitutions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);

    const [selectedInstitution, setSelectedInstitution] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/institutions`)
            .then(res => res.json())
            .then(setInstitutions)
    }, []);

    useEffect(() => {
        if (selectedInstitution) {
            setSelectedDepartment("");
            fetch(`${import.meta.env.VITE_API_URL}/api/departments?institutionId=${selectedInstitution}`)
                .then(res => res.json())
                .then(setDepartments)
        }
    }, [selectedInstitution]);

    useEffect(() => {
        if (selectedDepartment) {
            fetch(`${import.meta.env.VITE_API_URL}/api/courses?departmentId=${selectedDepartment}`)
                .then(res => res.json())
                .then(setCourses)
        }
    }, [selectedDepartment]);

    const handleClear = () => {
        setSelectedInstitution("");
        setSelectedDepartment("");
    }


    return (
        <div className="min-h-screen bg-gray-100 p-12">
            <button className="mb-8 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                style={{ backgroundColor: "#7F77DD"}}
                onClick={handleClear}>
                Clear All
            </button>

            <p className="mb-8">Institution</p>
            <div className="grid grid-cols-3 gap-4">
                {institutions.map(inst => (
                    <SelectCard
                        key={inst.id}
                        label={inst.name}
                        selected={selectedInstitution === inst.id}
                        onClick={() => setSelectedInstitution(inst.id)}
                    />
                ))}
            </div>

            {/* department section */}
            {selectedInstitution && (
                <>
                    <p className="my-8">Department</p>
                    <div className="grid grid-cols-3 gap-4">
                        {departments.map(dept => (
                            <SelectCard
                                key={dept.id} 
                                label={dept.name}
                                selected={selectedDepartment === dept.id}
                                onClick={() => setSelectedDepartment(dept.id)}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* courses section */}
            {selectedDepartment && (
                <>
                    <p className="my-8">Courses</p>
                    <div className="grid grid-cols-3 gap-4">
                        {courses.map(course => (
                            <SelectCard
                                key={course.id}
                                label={course.code}
                                subLabel={course.name}
                                selected={false}
                                onClick={() => navigate(`/courses/${course.id}`)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div> 
    );
}

export default FindReview;
