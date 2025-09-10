import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../config/AuthContext.jsx';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", href: "/home" },
    { name: "Mis Historias", href: "/myworks" },
    { name: "Explorar", href: "/explore" },
    { name: "Crear Historia", href: "/create-story" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo/Brand */}
        <Link to="/home" className="flex items-center space-x-2">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Writook
          </div>
        </Link>

        {/* Center Navigation Links - Desktop */}
        <ul className="hidden md:flex items-center space-x-1 text-sm text-gray-700">
          {links.map((link, index) => (
            <li key={index} className="nav-link-fade">
              <Link 
                to={link.href}
                className="hover:text-purple-600 transition-colors duration-200 px-2 py-1"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* User Profile */}
        <div className="flex items-center space-x-4">

          {/* User profile section */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <div className="text-black font-semibold text-sm">
                {user?.displayName || user?.username || 'Invitado'}
              </div>
              <div className="text-gray-500 text-xs">
                Escritor
              </div>
            </div>
            
            {/* User avatar */}
            {user?.profilePictureUrl ? (
              <img 
                src={user.profilePictureUrl} 
                alt="Profile"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-purple-200"
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                {(user?.displayName || user?.username || 'U').charAt(0).toUpperCase()}
              </div>
            )}

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="hidden sm:block text-gray-500 hover:text-red-500 transition-colors duration-200 text-sm"
              title="Cerrar sesión"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden focus:outline-none p-2"
            onClick={toggleMobileMenu}
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden transition-all duration-300 px-4 pb-4 bg-white shadow-lg ${
          isMobileMenuOpen 
            ? 'block opacity-100 transform scale-100' 
            : 'hidden opacity-0 transform scale-95'
        }`}
      >
        <ul className="space-y-3 text-sm text-gray-700">
          {links.map((link, index) => (
            <li key={index}>
              <Link 
                to={link.href}
                className="block py-3 px-4 hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
          {/* Mobile logout */}
          <li>
            <button
              onClick={handleLogout}
              className="block w-full text-left py-3 px-4 text-red-500 hover:bg-red-50 rounded-md transition-colors duration-200"
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;