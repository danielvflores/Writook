import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuth from '../config/AuthContext.js';

function InitialPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (user) {
      navigate('/home', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold text-white mb-8 animate-fade-in">
          Writook
        </h1>
        
        {/* Main Button */}
        <Link 
          to="/register"
          className="group relative inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-indigo-500 hover:to-blue-500 active:scale-95 text-decoration-none"
        >
          <span className="relative z-10">Start Writing</span>

          {/* Brilliance Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:animate-shine rounded-lg"></div>
          
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <div className="absolute inset-0 transform scale-0 group-active:scale-100 transition-transform duration-200 bg-white opacity-20 rounded-lg"></div>
          </div>
        </Link>

        {/* Button Secondary */}
        <div className="mt-6">
          <Link 
            to="/login"
            className="inline-block px-6 py-3 border-2 border-white text-white font-medium rounded-lg transition-all duration-300 hover:bg-white hover:text-indigo-900 transform hover:scale-105 active:scale-95 text-decoration-none"
          >
            Explore Stories
          </Link>
        </div>

        {/* Text with Animation */}
        <p className="text-indigo-200 animate-pulse mt-8">
          Your next great story begins here
        </p>
      </div>
    </div>
  );
}

export default InitialPage;