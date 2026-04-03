import './CreatePost.css';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Select from 'react-select';

function CreatePost() {

    const { courseId } = useParams();
    /* Moves to another page after posting */
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [assignments, setAssignments] = useState('');
    const [exams, setExams] = useState('');
    const [labs, setLabs] = useState('');
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState(null);

    const [professors, setProfessors] = useState([]);
    const [selectedProfessor, setSelectedProfessor] = useState('');
    const [showAddProfessor, setShowAddProfessor] = useState(false);
    const [newProfessor, setNewProfessor] = useState('');
    const [userId, setUserId] = useState(null);

    /* Fetches the selected course details when the page opens */
    useEffect(() => {
        async function fetchCourseDetails() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${courseId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch course details');
                }

                const data = await response.json();
                setCourse(data);
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        }

        fetchCourseDetails();
    }, [courseId]);

    // fetch professors for this course's department once course data is available
    useEffect(() => {
        if (course?.department_id) {
            fetch(`${import.meta.env.VITE_API_URL}/api/professors?departmentId=${course.department_id}`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch professors');
                    return res.json();
                })
                .then(setProfessors)
                .catch(err => console.error('Error fetching professors:', err));
        }
    }, [course]);

    const handleAddProfessor = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/professors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: newProfessor,
                departmentId: course.department_id,
                institutionId: course.institution_id,
                courseId: courseId
            })
        });
        const created = await res.json();
        setProfessors([...professors, created]);
        setSelectedProfessor(created.id);
        setShowAddProfessor(false);
        setNewProfessor('');
    };
    let userID = null;
    const userLoggedIn = localStorage.getItem('token');
    const tokenExpiration = parseInt(localStorage.getItem('expiresAt'), 10);

    useEffect(() => {
        if (!userLoggedIn || Date.now() > tokenExpiration) {
            alert('You must be logged in to post a review');
            navigate('/auth', { state: { from: `/courses/${courseId}/review` } });
        } else {
            fetch(`${import.meta.env.VITE_API_URL}/api/auth/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userLoggedIn}`,
                },
            })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch user data');
                return res.json();
            })
            .then(data => {
                setUserId(data.user.id);
            })
            .catch(err => {
                console.error('Error fetching user data:', err);
                alert('Session expired. Please log in again.');
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('expiresAt');
                navigate('/auth', { state: { from: `/courses/${courseId}/review` } });
            });
        }
    }, [userLoggedIn, tokenExpiration, navigate, courseId]);

    // Post submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        setLoading(true);

        const reviewData = {
            rating: rating,
            title: e.target['review-title'].value,
            content: e.target['review-content'].value,
            assignments: assignments || undefined,
            exams: exams || undefined,
            labs: labs || undefined,
            courseId: courseId,
            professorId: selectedProfessor,
            userId: userId
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(reviewData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create review');
            }

            const result = await response.json();
            console.log('Review created successfully:', result);
            alert('Review posted successfully!');
            
            // Reset form
            e.target.reset();
            setRating(0);
            setShowDetails(false);
        } catch (error) {
            console.error('Error submitting review:', error);
            alert(error.message || 'Failed to post review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="create-post bg-gray-100 flex justify-center items-center p-12 text-gray-800">
            <form className="create-post-panels" onSubmit={handleSubmit}>

            <div className="container bg-white p-20 rounded-lg shadow-md">
                
                <h1 className='font-bold text-4xl mb-4'>Add A Review</h1>

                {/* Shows the selected course information */}
                <h2 className="course-name text-2xl font-semibold mb-2">
                    {course ? `${course.code} - ${course.name}` : '[Course Name]'} 
                </h2>

                {/* Shows the selected department information */}
                <h3 className="department text-lg font-medium mb-1">
                    {course ? course.department_name : '[Department]'}
                </h3>

                {/* Shows the selected institution information */}
                <h3 className="institution text-lg font-medium mb-1">
                    {course ? course.institution_name : '[Institution]'}
                </h3>
                <br/>

                {/* Professor selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Professor</label>
                    <Select
                        options={professors.map(p => ({ value: p.id, label: p.name }))}
                        value={professors.map(p => ({ value: p.id, label: p.name })).find(opt => opt.value === selectedProfessor) ?? null}
                        onChange={(opt) => setSelectedProfessor(opt?.value ?? '')}
                        placeholder="Select Professor"
                        required
                        unstyled
                        classNames={{
                            control: () =>
                                'w-full border border-gray-200 rounded-lg px-3 py-1 text-sm focus-within:ring-2 focus-within:ring-purple-400 bg-white cursor-pointer',
                            menu: () =>
                                'mt-1 border border-gray-200 rounded-lg bg-white shadow-md overflow-hidden',
                            menuList: () => 'py-1',
                            option: ({ isFocused }) =>
                                `px-4 py-2 cursor-pointer ${isFocused ? 'bg-purple-50 text-purple-700' : 'text-gray-700'}`,
                            singleValue: () => 'text-gray-700',
                            placeholder: () => 'text-gray-400',
                        }}
                    />
                    {!showAddProfessor && (
                        <p
                            className="text-xs mt-1 cursor-pointer"
                            style={{ color: '#7F77DD' }}
                            onClick={() => setShowAddProfessor(true)}
                        >
                            + Can't find your professor? Add them here.
                        </p>
                    )}
                    {showAddProfessor && (
                        <div className="flex gap-2 mt-2">
                            <input
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                                type="text"
                                placeholder="Professor Name"
                                value={newProfessor}
                                onChange={e => setNewProfessor(e.target.value)}
                            />
                            <button
                                type="button"
                                className="text-sm px-4 py-1 rounded-lg text-white"
                                style={{ backgroundColor: '#7F77DD' }}
                                onClick={handleAddProfessor}
                            >
                                Add
                            </button>
                            <button
                                type="button"
                                className="text-sm px-3 py-1 rounded-lg border border-gray-200 text-gray-500"
                                onClick={() => setShowAddProfessor(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="create-post-form text-gray-600 font-medium text-sm">
                    
                    {/* Rating - Star System */}
                    <label htmlFor="rating" className="mb-2">Rate the Course</label>
                    <div className="star-rating flex flex-row gap-2">
                        {[...Array(5)].map((star, index) => {
                            const ratingValue = index + 1;
                            return (
                                <label key={index}>
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={ratingValue}
                                        onClick={() => setRating(ratingValue)}
                                        style={{ display: 'none' }}
                                    />
                                    <FaStar
                                        size={25}
                                        color={ratingValue <= (hover || rating) ? "#5A7ACD" : "#e4e5e9"}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(0)}
                                        style={{ cursor: 'pointer', marginBottom: '1.5rem' }}
                                    />
                                </label>
                            );
                        })}
                    </div>

                    {/* Post Title and Content */}
                    <h2 className='mb-2'>Write Your Review:</h2>
                    <input type="text" id="review-title" name="review-title" placeholder='Give Your Review a Title*'required />
                    <textarea id="review-content" name="review-content" rows="5" placeholder='Write Your Review Content Here*' required></textarea>

                    {/* Checkbox to reveal additional details panel */}
                    <div>
                        <label htmlFor="additional-checkbox" className='mr-2 text-sm'>Want to go into more details?</label>
                        <input 
                            type="checkbox" 
                            id="additional-checkbox" 
                            name="additional-checkbox"
                            checked={showDetails}
                            onChange={(e) => {
                                setShowDetails(e.target.checked);
                                if (!e.target.checked) {
                                    setAssignments('');
                                    setExams('');
                                    setLabs('');
                                }
                            }}
                        />
                    </div>

                    {/* Submit button shown only when details panel is hidden */}
                    <div
                        className="submit-btn-wrap text-sm py-1 rounded-lg text-white"
                        style={{ animation: `${showDetails ? 'transition-out' : 'transition-in'} 0.3s forwards` }}
                    >
                        <button type="submit" disabled={loading}>
                            {loading ? 'Posting...' : 'Add Review'}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL (additional details) ── */}
            <div className={`details-panel bg-white rounded-lg shadow-md${showDetails ? ' details-panel--visible' : ''}`}>
                <div className="create-post-form text-gray-600 font-medium text-sm">
                    <h2 className="details-title">Additional Details</h2>

                    <label htmlFor="assignments" className='mb-2'>Assignments:</label>
                    <textarea
                        id="assignments"
                        name="assignments"
                        rows="3"
                        cols="60"
                        placeholder="Describe the assignments for this course (optional)"
                        value={assignments}
                        onChange={(e) => setAssignments(e.target.value)}
                    ></textarea>

                    <label htmlFor="exams" className='mb-2'>Exams:</label>
                    <textarea
                        id="exams"
                        name="exams"
                        rows="3"
                        cols="60"
                        placeholder="Describe the exams for this course (optional)"
                        value={exams}
                        onChange={(e) => setExams(e.target.value)}
                    ></textarea>

                    <label htmlFor="labs" className='mb-2'>Labs:</label>
                    <textarea
                        id="labs"
                        name="labs"
                        rows="3"
                        cols="60"
                        placeholder="Describe the labs for this course (optional)"
                        value={labs}
                        onChange={(e) => setLabs(e.target.value)}
                    ></textarea>

                    {/* Submit button shown in the details panel when it is open */}
                    <div
                        className="submit-btn-wrap"
                        style={{ animation: `${showDetails ? 'transition-in' : 'transition-out'} 0.3s forwards` }}
                    >
                        <button type="submit" disabled={loading}>
                            {loading ? 'Posting...' : 'Add Review'}
                        </button>
                    </div>
                </div>
            </div>

            </form>
        </section>
    );
}

export default CreatePost;