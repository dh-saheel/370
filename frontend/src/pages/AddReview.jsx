import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const AddReview = () => {
    const navigate = useNavigate();

    const [institutions, setInstitutions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);

    const [selectedInstitution, setSelectedInstitution] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");

    const [showAddInstitution, setShowAddInstitution] = useState(false);
    const [showAddDepartment, setShowAddDepartment] = useState(false);
    const [showAddCourse, setShowAddCourse] = useState(false);

    // user inputs for new institution/department/course creation
    const [newInstitution, setNewInstitution] = useState("");
    const [newDepartment, setNewDepartment] = useState("");
    const [newCourse, setNewCourse] = useState({name: "", code: ""});

    const institutionOptions = institutions.map(inst => ({ value: inst.id, label: inst.name }));
    const departmentOptions = departments.map(dept => ({ value: dept.id, label: dept.name }));
    const courseOptions = courses.map(c => ({ value: c.id, label: `${c.code} - ${c.name}` }));

    // runs once on page load, fetches all institutions to fill in the institution dropdown
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/institutions`)
            .then(res => res.json())
            .then(setInstitutions);
    }, []);

    // everytime the a user selects an institution, fetch the departments associated with that institution and fill in the department dropdown
    // with proper department options
    useEffect(() => {
        if (selectedInstitution) {
            setSelectedDepartment("");
            setSelectedCourse("");
            fetch(`${import.meta.env.VITE_API_URL}/api/departments?institutionId=${selectedInstitution}`)
                .then(res => res.json())
                .then(setDepartments);
        }
    }, [selectedInstitution]);

    // everytime the a user selects a department, fetch the courses associated with that department and fill in the course dropdown
    // with proper course options
    useEffect(() => {
        if (selectedDepartment) {
            setSelectedCourse("");
            fetch(`${import.meta.env.VITE_API_URL}/api/courses?departmentId=${selectedDepartment}`)
                .then(res => res.json())
                .then(setCourses);
        }
    }, [selectedDepartment]);

    // adds a new institution to the database and selects it automatically
    const handleAddInstitution = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/institutions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newInstitution })
        });
        const created = await res.json();
        setInstitutions([...institutions, created]);
        setSelectedInstitution(created.id);
        setShowAddInstitution(false);
        setNewInstitution("");
    };
    
    // same pattern for the department and course addition handlers

    const handleAddDepartment = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/departments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newDepartment, institutionId: selectedInstitution })
        });
        const created = await res.json();
        setDepartments([...departments, created]);
        setSelectedDepartment(created.id);
        setShowAddDepartment(false);
        setNewDepartment("");
    };

    const handleAddCourse = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: newCourse.name,
                code: newCourse.code,
                departmentId: selectedDepartment,
                institutionId: selectedInstitution
            })
        });
        const created = await res.json();
        setCourses([...courses, created]);
        setSelectedCourse(created.id);
        setShowAddCourse(false);
        setNewCourse({ name: "", code: "" });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
            <div className="bg-white rounded-lg border border-gray-200 p-8 w-full max-w-lg">

                <h2 className="text-2x1 font-medium mb-1">Add A Review</h2>
                <p className="text-sm text-gray-400 mb-6">Find your course to get started</p>

                {/* institution dropdown */}
                <div className="flex flex-col gap-5">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Institution</p>
                        <Select
                            options={institutionOptions}
                            value={institutionOptions.find(opt => opt.value === selectedInstitution) ?? null}
                            onChange={(opt) => setSelectedInstitution(opt?.value ?? '')}
                            maxMenuHeight={36 * 6}
                            classNamePrefix="rs"
                            unstyled
                            classNames={{
                                control: () =>
                                    'w-full border border-gray-200 rounded-lg px-4 py-1 focus-within:ring-2 focus-within:ring-purple-400 bg-white cursor-pointer',
                                menu: () =>
                                    'mt-1 border border-gray-200 rounded-lg bg-white shadow-md overflow-hidden',
                                menuList: () => 'py-1',
                                option: ({ isFocused }) =>
                                    `px-4 py-2 cursor-pointer ${isFocused ? 'bg-purple-50 text-purple-700' : 'text-gray-700'}`,
                                singleValue: () => 'text-gray-700',
                                placeholder: () => 'text-gray-400',
                            }}
                        />
                            

                        {!showAddInstitution && (
                            <p
                                className="text-xs mt-1 cursor-pointer"
                                style={{ color: "#7F77DD"}}
                                onClick={() => setShowAddInstitution(true)}
                            >
                                + Can't find your institution? Add it here.
                            </p> 
                        )}
                    </div>
                    {showAddInstitution && (
                        <div className="flex gap-2 mt-2">
                            <input 
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                                type="text"
                                placeholder="Institution Name"
                                value={newInstitution}
                                onChange={e => setNewInstitution(e.target.value)}
                            />
                            <button
                                className="text-sm px-4 py-1 rounded-lg text-white"
                                style={{ backgroundColor: "#7F77DD" }}
                                onClick={handleAddInstitution}
                            >
                                Add
                            </button>
                            <button
                                className="text-sm px-3 py-1 rounded-lg border border-gray-200 text-gray-500"
                                onClick={() => setShowAddInstitution(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* department dropdown */}
                <div className="flex flex-col gap-5 mt-5">
                    <p className="text-sm text-gray-500 mb-1">Department</p>
                    <Select
                        options={departmentOptions}
                        value={departmentOptions.find(opt => opt.value === selectedDepartment) ?? null}
                        onChange={(opt) => setSelectedDepartment(opt?.value ?? '')}
                        placeholder="Select Department"
                        maxMenuHeight={36 * 6}
                        unstyled
                        classNames={{
                            control: () =>
                                'w-full border border-gray-200 rounded-lg px-4 py-1 focus-within:ring-2 focus-within:ring-purple-400 bg-white cursor-pointer',
                            menu: () =>
                                'mt-1 border border-gray-200 rounded-lg bg-white shadow-md overflow-hidden',
                            menuList: () => 'py-1',
                            option: ({ isFocused }) =>
                                `px-4 py-2 cursor-pointer ${isFocused ? 'bg-purple-50 text-purple-700' : 'text-gray-700'}`,
                            singleValue: () => 'text-gray-700',
                            placeholder: () => 'text-gray-400',
                        }}
                    />
                    {!showAddDepartment && (
                        <p
                            className="text-xs mt-1 cursor-pointer"
                            style={{ color: "#7F77DD"}}
                            onClick={() => setShowAddDepartment(true)}
                        >
                            + Can't find your department? Add it here.
                        </p> 
                    )}
                    {showAddDepartment && (
                        <div className="flex gap-2 mt-2">
                            <input 
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                                type="text"
                                placeholder="Department Name"
                                value={newDepartment}
                                onChange={e => setNewDepartment(e.target.value)}
                            />
                            <button
                                className="text-sm px-4 py-1 rounded-lg text-white"
                                style={{ backgroundColor: "#7F77DD" }}
                                onClick={handleAddDepartment}
                            >
                                Add
                            </button>
                            <button
                                className="text-sm px-3 py-1 rounded-lg border border-gray-200 text-gray-500"
                                onClick={() => setShowAddDepartment(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* course dropdown */}
                <div className="flex flex-col gap-5 mt-5">
                    <p className="text-sm text-gray-500 mb-1">Course</p>
                    <Select
                        options={courseOptions}
                        value={courseOptions.find(opt => opt.value === selectedCourse) ?? null}
                        onChange={(opt) => setSelectedCourse(opt?.value ?? '')}
                        placeholder="Select Course"
                        maxMenuHeight={36 * 6}
                        unstyled
                        classNames={{
                            control: () =>
                                'w-full border border-gray-200 rounded-lg px-4 py-1 focus-within:ring-2 focus-within:ring-purple-400 bg-white cursor-pointer',
                            menu: () =>
                                'mt-1 border border-gray-200 rounded-lg bg-white shadow-md overflow-hidden',
                            menuList: () => 'py-1',
                            option: ({ isFocused }) =>
                                `px-4 py-2 cursor-pointer ${isFocused ? 'bg-purple-50 text-purple-700' : 'text-gray-700'}`,
                            singleValue: () => 'text-gray-700',
                            placeholder: () => 'text-gray-400',
                        }}
                    />
                    {!showAddCourse && (
                        <p
                            className="text-xs mt-1 cursor-pointer"
                            style={{ color: "#7F77DD"}}
                            onClick={() => setShowAddCourse(true)}
                        >
                            + Can't find your course? Add it here.
                        </p> 
                    )}
                    {showAddCourse && (
                        <div className="flex flex-col gap-2 mt-2">
                            <input
                                className="w-full border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                                placeholder="Course name"
                                onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
                            />
                            <input
                                className="w-full border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                                placeholder="Course code (e.g. CMPT 370)"
                                onChange={e => setNewCourse({ ...newCourse, code: e.target.value })}
                            />
                            <div className="flex gap-2">
                                <button
                                    className="text-sm px-4 py-1 rounded-lg text-white"
                                    style={{ background: "#7F77DD" }}
                                    onClick={handleAddCourse}
                                >
                                    Add
                                </button>
                                <button
                                    className="text-sm px-3 py-1 rounded-lg border border-gray-200 text-gray-500"
                                    onClick={() => setShowAddCourse(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
{/* dont touch */}
                <button
                    className="w-full py-2 rounded-lg text-white font-medium mt-2"
                    style={{ background: "#7F77DD" }}
                    disabled={!selectedInstitution || !selectedDepartment || !selectedCourse}
                    onClick={() => navigate(`/courses/${selectedCourse}/review`)}
                >
                    Continue to Review </button>
            </div>
        </div>
    );
};

export default AddReview;