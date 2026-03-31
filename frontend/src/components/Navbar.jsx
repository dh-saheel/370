import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import DefaultIcon from '../assets/defaultIcon.svg';
import tempLogoNeg from '../assets/tempLogoNeg.svg';


const Navbar = () => {

    const [verifiedUser, setVerifiedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        // if token is expired, remove it from localStorage and return
        if (Date.now() > parseInt(localStorage.getItem('expiresAt'), 10)) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('expiresAt');
            return;
        }
        
        const handleVerifyToken = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (data.valid) {
                    setVerifiedUser(data.username);
                } else {
                    setVerifiedUser(null);
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                setVerifiedUser(null);
            }
        };

        handleVerifyToken();
    }

    useEffect(() => {
        checkAuth();
    }, [location.pathname]);

    const handleSearch = (e) => {
        e.preventDefault();

        const trimmed = searchTerm.trim();

        if (!trimmed) {
            return;
        }

        navigate(`/search?query=${encodeURIComponent(trimmed)}`);
    }

    return (
        <nav className="w-full bg-purple-700 shadow">
            <div className="max-w-7xl mx-auto py-4 flex items-center justify-between text-white">
                <h1 className="text-xl font-bold">
                    <Link to="/">
                        <img src={tempLogoNeg} alt="Logo" className="h-8" />
                    </Link>
                </h1>

                <div className="flex items-center gap-10">
                    <Link to="/find-review" className="hover:text-gray-300 transition-colors duration-200 font-bold">Find Reviews</Link>
                    <Link to="/add-review" className="hover:text-gray-300 transition-colors duration-200 font-bold">Add A Review</Link>
                    <Link to="/courses" className="hover:text-gray-300">Course Reviews</Link>

                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Search... e.g., CMPT 370"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded-full px-3 py-1 w-64 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button type="submit">
                            <FaSearch size={20} color="white" />
                        </button>
                    </form>

                    {verifiedUser ? (
                        <Link to="/dashboard" className="hover:text-gray-300 transition-colors duration-200 font-bold flex items-center gap-2">
                            <img src={DefaultIcon} alt="User Icon" className="h-6 w-6 rounded-full" />
                            {verifiedUser}
                        </Link>
                    ) : (
                        <Link to="/auth" className="hover:text-gray-300 transition-colors duration-200 font-bold">Login/Signup</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
