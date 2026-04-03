import { useEffect, useState } from "react";

/* Reads course id from url */
import { useParams } from "react-router-dom";
import Select from "react-select";
import CourseHeader from "../components/CourseHeader";
import ReviewContainer from "../components/ReviewContainer";

export default function CourseReviewPage(){

  /* Gets the current course id from the route */
  const { courseId } = useParams();

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "highest", label: "Highest Rating" },
    { value: "lowest", label: "Lowest Rating" },
  ];

  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);

  /* Empty list of reviews */
  const [reviews, setReviews] = useState([]);

  /* Stores the selected course details */
  const [course, setCourse] = useState(null);

  /* Gets the selected course details */
  async function getCourseDetails(){
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${courseId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch couse details");
      }

      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  }

  /* Gets the review data for the selected course */
  async function getMyReviews( sortBy = "newest" ) {
    try{
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews?courseId=${courseId}&sortBy=${sortBy}`);

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }

  /* Flags one review */
  async function flagReview(reviewId){
    console.log("flagReview started for:", reviewId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}/flag`, {
        method: "PATCH"
      });

      console.log("PATCH status:", response.status);

      if (!response.ok){
        throw new Error("Failed to flag review");
      }

      const result = await response.json();
      console.log("PATCH result:", result);

      /* Update the review list so the flagged review turns red */
      const updatedReviews = reviews.map(function(singleReview) {
        if (singleReview.id === reviewId) {
          return result.data;
        } else {
          return singleReview
        }
      });

      setReviews(updatedReviews);
    } catch (error) {
      console.error("Error flagging review:", error);
    }
  }

  /* Unflag one review */
  async function unflagReview(reviewId) {
    console.log("unflagReview started for:", reviewId);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}/unflag`,{
        method: "PATCH"
      });

      if (!response.ok){
        throw new Error("Failed to unflag review");
      }

      const result = await response.json();

      const updatedReviews = reviews.map(function(singleReview) {
        if (singleReview.id === reviewId) {
          return result.data;
        } else {
          return singleReview;
        }
      });

      setReviews(updatedReviews);
    } catch (error) {
      console.error("Error unflagging review:", error);
    }
  }

  /* Tells react to run the getMyReviews function when the page opens */
  useEffect(() => {
    getCourseDetails();
    getMyReviews();
  }, [courseId]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 font-mono bg-white">

      {/* Course header — only rendered once data is available */}
      {course && <CourseHeader course={course} />}

      {/* Reviews */}
      <div className="border rounded-xl overflow-hidden">
        <div className="flex flex-row justify-between px-6 py-4">
          <h4 className="text-lg uppercase font-bold tracking-wide m-0">Reviews</h4>
          <Select
            options={sortOptions}
            value={selectedSort}
            onChange={(opt) => { setSelectedSort(opt); getMyReviews(opt.value); }}
            isSearchable={false}
            unstyled
            classNames={{
              control: () =>
                'min-w-[200px] border border-gray-200 rounded-lg px-4 py-1 focus-within:ring-2 focus-within:ring-purple-400 bg-white cursor-pointer',
              menu: () =>
                'mt-1 border border-gray-200 rounded-lg bg-white shadow-md overflow-hidden',
              menuList: () => 'py-1',
              option: ({ isFocused }) =>
                `px-4 py-2 cursor-pointer ${isFocused ? 'bg-purple-50 text-purple-700' : 'text-gray-700'}`,
              singleValue: () => 'text-gray-700',
            }}
          />
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <ReviewContainer
            reviewList={reviews}
            onFlag={flagReview}
            onUnflag={unflagReview}
          />
        </div>
      </div>
    </div>
  );
}
