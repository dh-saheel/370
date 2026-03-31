import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Auth.css';
import axios from 'axios';

export default function Auth() {

  const navigate = useNavigate();
  const prevLocation = useLocation().state?.from || '/';
  const [isLogin, setIsLogin] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleToggle = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsLogin((prev) => !prev);
      setFormData({ username: '', email: '', password: '' });
      setIsTransitioning(false);
    }, 300);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login logic
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
          username: formData.username,
          password: formData.password,
        });
        alert('Login successful!');
        localStorage.setItem('token', response.data.token); // Store token in localStorage
        localStorage.setItem('username', response.data.username); // Store username in localStorage
        localStorage.setItem('isAdmin', response.data.isAdmin); // Store Admin Creds
        localStorage.setItem('expiresAt', response.data.expiresAt); // Store token expiration time
        navigate(prevLocation);
      } else {
        // Signup logic
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        alert('Signup successful! Please log in.');
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="auth-container flex w-100vw h-[93vh]">
      <div className="banner-text w-[45vw] bg-purple-500 flex items-center text-left p-16">
        <div>
          <h1 className='text-5xl font-bold text-white mb-5'>Welcome to CR!</h1>
          <p className='text-white'>Start your journey with us today.</p>
        </div>
      </div>
      <div className='p-20 flex items-center justify-center text-center w-[55vw] relative'>
            <div 
              className={`login-form${isLogin && !isTransitioning ? ' transition-in' : ' transition-out'}`} 
              style={{ animation: `${isLogin && !isTransitioning ? 'transition-in' : 'transition-out'} 0.3s forwards` }}
            >
                <h2 className='text-4xl font-bold mb-10'>Hello! Welcome Back!</h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <input 
                    type="text" 
                    name="username" 
                    placeholder='Username'
                    className="p-2 border rounded" 
                    value={formData.username} 
                    onChange={handleChange} 
                    required 
                  />
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    className="p-2 border rounded" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                  />
                  <button type="submit" className="bg-purple-500 text-white px-6 py-3 rounded">Login</button>
                </form>
                <p className="mt-8">
                Don't have an account? 
                <button className="btn signup text-purple-500 px-2 font-bold" onClick={handleToggle}>Sign Up</button>
                </p>
            </div>
            <div 
              className={`signup-form${!isLogin && !isTransitioning ? ' transition-in' : ' transition-out'}`} 
              style={{ animation: `${!isLogin && !isTransitioning ? 'transition-in' : 'transition-out'} 0.3s forwards` }}
            >
                <h2 className='text-4xl font-bold mb-10'>Join Us! Create an Account</h2>
                <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
                  <input 
                    type="text" 
                    name="username" 
                    placeholder="Username" 
                    className="p-2 border rounded" 
                    value={formData.username} 
                    onChange={handleChange} 
                    required 
                  />
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    className="p-2 border rounded" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required={!isLogin} 
                  />
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    className="p-2 border rounded" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                  />
                  <button type="submit" className="bg-purple-500 text-white px-6 py-3 rounded">Sign Up</button>
                </form>
                <p className="mt-8">
                Already have an account? 
                <button className="btn login text-purple-500 px-2 font-bold" onClick={handleToggle}>Login</button>
                </p>
            </div>
        </div>
    </div>
  );
}