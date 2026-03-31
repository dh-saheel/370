import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPost from '../components/AdminPost';

const API = `${import.meta.env.VITE_API_URL}/api/admin`

const scrollContainerStyle = "h-[80vh] overflow-y-auto space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50";
const dropDownStyle = "p-2 border rounded"

const Actions = {
  DELETE: 'delete',
  KEEP: 'keep',
  BAN: 'ban',
}

const AdminPage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState("20");
  const [timeSort, setTimeSort] = useState('created_desc');
  const [flagSort, setFlagSort] = useState('flags_desc');
  const [isAdmin, setIsAdmin] = useState(false);

  async function checkIsAdmin() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return false;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const data = await res.json();
      return data.isAdmin; 
    } catch (error) {
      console.error("Error verifying token:", error);
      return false;
    }
  };

  async function showAdmin() {
    const authorized = await checkIsAdmin();

    if (authorized) {
      setIsAdmin(authorized);
      getReportedContent();
    } else {
      navigate("/auth");
    }
  };


  /* Gets the reported content to display */
  async function getReportedContent() {
    const response = await fetch(`${API}/reports?limit=${limit}&timeSort=${timeSort}&flagSort=${flagSort}`);
    
    const data = await response.json();
    
    setContent(data);
    setLoading(false);
  }

  useEffect(() => {
    showAdmin();
  }, [limit, timeSort, flagSort]);


  /* Removes the report from the UI. Also removes the flags from the review in the database. */
  async function removeReport(reviewId) {
    try {
      const response = await fetch(`${API}/reports/${reviewId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setContent(prevContent => prevContent.filter(report => report.review_id !== reviewId));
      } else {
        alert("Failed to remove the report.");
      } 
    } catch (err) {
      console.error("Delete Report Error:", err);
    }
  }

  /* Removes the reported content from the database and from the report list. */
  async function removeReportedContent(reviewId) {
      try {
        const response = await fetch(`${API}/reviews/${reviewId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setContent(prevContent => prevContent.filter(report => report.review_id !== reviewId));
        } else {
          alert("Failed to remove the review.");
        } 
      } catch (err) {
        console.error("Delete Review Error:", err);
      }
    }

  /* Flags user in the database as banned. */
  async function banUser(userId) {
    try {
      const response = await fetch(`${API}/users/${userId}`, {
        method: 'PATCH',
      })
      if (response.ok) {
        setContent(prevContent => prevContent.map(report => report.review_author_id === userId 
          ? { ...report, is_banned: true } : report
        ));                
      } else {
        alert("Failed to remove the review and user.");
      } 
    } catch (err) {
      console.error("Delete Review And User Error:", err);
    }
  }

  /* Handles the buttons inputs for the admin page. */
  async function handleReportedContent(id, action) {
    if (action == Actions.KEEP) {
      removeReport(id);
    }
    else if (action == Actions.DELETE) {
      removeReportedContent(id);
    }
    else if (action == Actions.BAN) {
      console.log("BAN ID", id);
      banUser(id);
    }
  }

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen text-gray-500'>
        <p className="font-medium">Loading Content</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <p>Invalid Admin Status</p>;
  }

  /* In a scroll box display all the reported content. */
  return (
    <div className='max-w-[700px] mx-auto'>
      <div className='bg-purple-500 text-white rounded-lg m-4'>
        <h2 className='text-lg text-center'>Reported Content</h2>
      </div>
      <div className='flex items-center gap-8 mb-4'>
        <div className='flex flex-col'>
          <p className='text-center text-sm'>Sort by Flags</p>
          <select 
            className={dropDownStyle}
            value={flagSort}
            onChange={(e) => setFlagSort(e.target.value)}
          >
            <option value="flags_desc">Highest Flags</option>
            <option value="flags_asc">Lowest Flags</option>
          </select>
        </div>
        <div className='flex flex-col'>
          <p className='text-center text-sm'>Sort by Time</p>
          <select 
            className={dropDownStyle}
            value={timeSort}
            onChange={(e) => setTimeSort(e.target.value)}
          >
            <option value="created_desc">Newest First</option>
            <option value="created_asc">Oldest First</option>
          </select>
        </div>
        <div className='flex flex-col'>
          <p className='text-center text-sm'>Amount of Posts</p>
          <select 
            className={dropDownStyle}
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          >
            <option value="1">1</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
      
      <div className={`${scrollContainerStyle}`}>
        {content.map((report) => (
            <AdminPost
                key={report.report_id}
                reportId={report.report_id}
                reviewId={report.review_id}
                actions={Actions}
                onAction={handleReportedContent}
                isBanned={report.is_banned}
                userName={report.reporter_name}
                flagCount={report.review_flags}
                reason={report.report_reason}
                postUserId={report.review_author_id}
                postUserName={report.review_author}
                courseName={report.course_name}
                professorName={report.professor_name}
                title={report.review_title}
                content={report.review_body}
                assignments={report.review_assignments}
                exams={report.review_exams}
                labs={report.review_labs}
                postCreatedAt={report.review_created_at}
                createdAt={report.report_created_at}
            />
        ))}
      </div>
    </div>
  );
};

export default AdminPage;