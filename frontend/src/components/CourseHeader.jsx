import { FaStar } from 'react-icons/fa';

function getRatingColor(rating) {
  if (!rating || rating <= 1) return "#DA3D20";
  if (rating <= 2)             return "#FF5F00";
  if (rating <= 3)             return "#FF8C00";
  if (rating <= 4)             return "#FFC300";
  return                              "#FFD400"; 
}

export default function CourseHeader({ course }) {
  return (
    <div className="mb-8 border rounded-xl p-6 font-mono bg-white shadow" >
      <div className="flex items-center justify-between gap-10 flex-wrap">
        <div className="flex flex-col gap-1 text-left">
          <h1 className="text-4xl font-bold">{course.code} — {course.name}</h1>
          <p className="text-gray-600 text-lg font-mono font-bold mt-1">{course.department_name}</p>
          <p className="text-gray-600 text-lg font-mono font-bold">{course.institution_name}</p>
        </div>
        <div className="flex flex-col items-center gap-1 text-lg p-12 shadow rounded-lg">
          <FaStar 
          color={getRatingColor(course.average_rating)} 
          size={72}
          />
          <span className='font-bold text-gray-700 text-2xl mt-4'>
            {course.average_rating ? Number(course.average_rating).toFixed(1) : "0.0"} / 5.0
          </span>
        </div>
      </div>
    </div>
  );
}