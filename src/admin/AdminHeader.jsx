// App.js
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // alert("Logged out");
  };

  return (
    <div>
      {/* Header Component */}
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo or Brand Name */}
          <div className="text-xl font-semibold">
            <Link to="/" className="hover:text-gray-400">
              Food
            </Link>
          </div>

          {/* Navigation Links for Desktop */}
          <nav className="hidden md:flex space-x-4">
            <Link
              to="/order"
              className="hover:text-gray-400 transition duration-200"
            >
              Order
            </Link>
            <Link
              to="/admin"
              className="hover:text-gray-400 transition duration-200"
            >
              Meals
            </Link>
          </nav>

          {/* Logout Button */}
          <div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden bg-gray-800 text-white">
            <Link
              to="/order"
              className="block px-4 py-2 hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Order
            </Link>
            <Link
              to="/admin"
              className="block px-4 py-2 hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Manage Meals
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 bg-red-500 hover:bg-red-600"
            >
              Logout
            </button>
          </nav>
        )}
      </header>
    </div>
  );
};

export default AdminHeader;
