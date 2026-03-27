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


/* Imports the react tools */
import React, { useEffect, useState } from "react";

/* Reads course id from url */
import { useParams } from "react-router-dom";

/* Imports the flag icon */
import { FaFlag } from "react-icons/fa";

export default function CourseReviewPage(){

  /* Gets the current course id from the route */
  const { courseId } = useParams();

  /* currentSection are the sections such as assignment, exam, and lab  that is currently clicked
   * setcurrentSection is a function that let's you click on a different section
  */
  const [currentSection, setcurrentSection] = React.useState("general");

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
  async function getMyReviews() {
    try{
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews?courseId=${courseId}`);

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
  

  /* Shows what reviews we see based on what section is clicked */
  function getReviewText(reviewData) {
    /* Shows general reviews */
    if (currentSection == "general") {
      return reviewData.content;
    }
    /* Shows assignment reviews */
    if (currentSection == "assignment") {
      return reviewData.assignments;
    }
    /* Shows exam reviews */
    if (currentSection == "exam") {
      return reviewData.exams;
    }
    /* Shows lab reviews */
    if (currentSection == "lab") {
      return reviewData.labs;
    }
    
  }


  /* Shows the background colors of the review */
  function getSectionColor(sectionName) {
    if (sectionName === "assignment") {
      /* Yellow for assignment */
      return "#fef3c7";

    } else if (sectionName === "exam") {
      /* Blue for exam */
      return "#bfdbfe";

    } else if (sectionName === "lab") {
      /* Green for lab */
      return "#bbf7d0";

    } else {
      /* White for general */
      return "white";
    }
  }


  /* Shows the color of the tab that is clicked */  
  function getTabColor(tabName) {
    if (currentSection === tabName) {
      return getSectionColor(tabName);
    } else {
      return "white";
    }
  }

  /* Placeholder values while data is loading */
  let courseName = "Placeholder course";
  let departmentName = "Placeholder department";
  let institutionName = "Placeholder institution";

  /* If course data exists replace the placeholder */
  if (course) {
    courseName = course.code + " - " + course.name;
    departmentName = course.department_name;
    institutionName = course.institution_name;
  }

  
  return (
  <div style={{ 
    padding: "100px", 
    fontFamily: "monospace"
    
    }}> 

    {/* Header */}
    <div style={{

      /* The Border */
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "black",

      /* The Spacing */
      padding: "10px",
      marginBottom: "50px",

      /* The Layout */
      display: "flex",
      justifyContent: "space-between"

    }}>
      {/* Course Name */}
      <strong>{courseName}</strong>

      {/* Department */}
      <strong>{departmentName}</strong>

      {/* Institution */}
      <strong>{institutionName}</strong>

      <span>Rating: {course?.average_rating || 0} <span style={{
         color: "blue" }}
         >★</span>
        </span>
    </div>
    
    {/* Main Container box for sections and reviews */}
    <div style={{ 

      /* Sets the Section and Reviews side by side */
      display: "flex",

      /* Border */
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "black",

      /* Dimensions */
      height: "500px"
  }}>


    {/* Left Section */}
    <div style={{
      width: "150px",
      borderRightWidth: "1px",
      borderRightStyle: "solid",
      borderRightColor: "black"
    }}>

      {/* General Review Tab on the left side */}
      <div 
      /* Click the general section to show general reviews */
      onClick={() => setcurrentSection("general")}
      style={{ 
        padding: "10px",
        cursor: "pointer",

        /* The default color of the general review is white */
        backgroundColor: "white",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "black",
      }}>General Reviews</div>


      {/* Assignment Review Tab on the left side */}
      <div 
      /* Click the assignment section to show assignment reviews */
      onClick={() => setcurrentSection("assignment")}
      style={{ 
        padding: "10px",
        cursor: "pointer",

        /* Checks if the current active section is assignments, switch tab yellow */
        backgroundColor: getTabColor("assignment"),
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "black",
      }}>Assignment Reviews</div>


      {/* Exam Review Tab on the left side*/}
      <div 
      /* Click the exam section to show exam reviews */
      onClick={() => setcurrentSection("exam")}
      style={{ 
        padding: "10px",
        cursor: "pointer",

        /* Checks if the current active section is exams, switch tab to blue */
        backgroundColor: getTabColor("exam"),
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "black",
      }}>Exam Reviews</div>


      {/* Lab Review Tab on the left side */}
      <div 
      /* Click the lab section to show lab reviews */
      onClick={() => setcurrentSection("lab")}
      style={{ 
        padding: "10px",
        cursor: "pointer",

        /* Checks if the current active section is labs, switch tab to green */
        backgroundColor: getTabColor("lab"),
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "black",
      }}>Lab Reviews</div>
</div>

      {/* Review Section on the right side */}
      <div style={{
        padding: "15px",
        flex: 1,

        /* Change the color of the review page to match the color of the section that was clicked */
        backgroundColor: getSectionColor(currentSection),
        display: "flex",

        /* Text will be top to bottom */
        flexDirection: "column",

        /* Allows the user to scroll infinitely inside the review section */
        overflowY: "auto"

      }}>
        {/* Review section title */}
        <div style={{ 
          padding: "15px",
          }}>
          <h4 style={{ 
            marginTop: 0,
            fontFamily: "monospace",
            fontSize: "20px",
            textTransform: "uppercase"
            }}>
          {currentSection} Reviews
          </h4>

          {/* Distance between the review title and the review capsules */}
          <div style={{
            marginTop: "50px" 
          }}></div>
          
          {/* Checks every reviews in the list */}
          {reviews.map(function(singleReview){
            
            /* Get the specific text using the function */
            const textToShow = getReviewText(singleReview);
            
            /* Checks if the text is empty */
            if (!textToShow || textToShow === "[@NA]") {
              return null;
          }
          
          /* Otherwise render the review capsule */
          return(
            <div key={singleReview.id} style={{
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "black",
                padding: "15px",
                marginBottom: "20px",
                borderRadius: "10px",
                backgroundColor: "white"
            }}>

            {/* Top row: Title on left, Flag on right */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
            {/* Review title */}
            <strong>{singleReview.title}</strong>

            {/* Flag icon */}
            <FaFlag
              onClick= {() =>{
                console.log("CLICKED FLAG:", singleReview.id, singleReview.flags);
                if (!singleReview.flags || Number(singleReview.flags) === 0) {

                  /* Gray to red */
                  flagReview(singleReview.id);
                } else {
                  /* Red to gray */
                  unflagReview(singleReview.id);
                }
              }}
              style={{
                cursor: "pointer",
                color: Number(singleReview.flags || 0) > 0 ? "red" : "gray",
                fontSize: "20px"
              }}
              title="Flag this review"
              />
            </div>

            {/* Review text */}
            <p style={{ marginTop: "10px" }}>{textToShow}</p>
            </div>
          );
          })}
        </div>
      </div>
    </div>
  </div>
  );
}
