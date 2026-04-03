import { use, useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ReviewContainer from "../components/ReviewContainer";

export default function UserDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");
    const [verifiedAdmin, setVerifiedAdmin] = useState(false);
    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/auth");
            return;
        }
        const headers = { Authorization: `Bearer ${token}` };

        Promise.all([
            fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, { headers }).then(r => r.json()),
            fetch(`${import.meta.env.VITE_API_URL}/api/users/me/reviews`, { headers }).then(r => r.json()),
        ]).then(([profileData, reviewsData]) => {
            setProfile(profileData);
            setReviews(Array.isArray(reviewsData) ? reviewsData : []);
            setLoading(false);
        });
    }, []);

    function signOut() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("expiresAt");
        localStorage.removeItem("isAdmin");
        navigate("/auth");
    }

    useEffect(() => {
        const isAdmin = localStorage.getItem("isAdmin") === "true";
        setVerifiedAdmin(isAdmin);
    }, []);


    async function flagReview(reviewId) {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}/flag`, {
                method: "PATCH",
            });
            if (!response.ok) throw new Error("Failed to flag review");
            const result = await response.json();
            setReviews(reviews.map(r => r.id === reviewId ? result.data : r));
        } catch (error) {
            console.error("Error flagging review:", error);
        }
    }

    async function unflagReview(reviewId) {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}/unflag`, {
                method: "PATCH",
            });
            if (!response.ok) throw new Error("Failed to unflag review");
            const result = await response.json();
            setReviews(reviews.map(r => r.id === reviewId ? result.data : r));
        } catch (error) {
            console.error("Error unflagging review:", error);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-gray-100 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {["profile", "reviews"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                                activeTab === tab
                                    ? "text-white"
                                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                            style={activeTab === tab ? { backgroundColor: "#7F77DD" } : {}}
                        >
                            {tab === "reviews" ? `My Reviews (${reviews.length})` : "Profile"}
                        </button>
                    ))}
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && profile && (
                    <div className="bg-white rounded-lg border border-gray-200 p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold bg-[#7F77DD]">
                                <FaUserCircle size={28} />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-800">{profile.username}</p>
                                <p className="text-sm text-gray-400">{profile.email}</p>
                            </div>
                            {verifiedAdmin ? (
                                <div className="ml-auto px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded">
                                    Admin
                                </div>
                            ) : null}
                        </div>
                        <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-400 mb-1">Username</p>
                                <p className="text-gray-700 font-medium">{profile.username}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Email</p>
                                <p className="text-gray-700 font-medium">{profile.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Member since</p>
                                <p className="text-gray-700 font-medium">
                                    {new Date(profile.created_at).toLocaleDateString("en-CA", {
                                        year: "numeric", month: "long", day: "numeric",
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Reviews posted</p>
                                <p className="text-gray-700 font-medium">{reviews.length}</p>
                            </div>
                        </div>
                        <button onClick={signOut} 
                        className="mt-6 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                            Sign Out
                        </button>
                    </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                    <div>
                        {reviews.length === 0 ? (
                            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                                <p className="text-gray-400 mb-4">You haven't posted any reviews yet.</p>
                                <Link
                                    to="/add-review"
                                    className="px-5 py-2 rounded-lg text-white text-sm font-medium"
                                    style={{ backgroundColor: "#7F77DD" }}
                                >
                                    Write a Review
                                </Link>
                            </div>
                        ) : (
                            <ReviewContainer
                                reviewList={reviews}
                                onFlag={flagReview}
                                onUnflag={unflagReview}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}