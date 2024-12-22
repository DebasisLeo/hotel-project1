import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { FaUser, FaSignOutAlt, FaHome, FaBookOpen, FaInfoCircle, FaRocket } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { AuthContext } from './AuthProvider';

const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContext);

 
  const handleSignOut = () => {
    signOutUser()
      .then(() => {
       
      })
      .catch((error) => {
        console.error('Sign out failed:', error.message);
      });
  };

  const links = (
    <>
      <li>
        <NavLink to="/" className="hover:text-primary flex items-center gap-2">
          <FaHome />
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/rooms" className="hover:text-primary flex items-center gap-2">
          <FaRocket />
          Rooms
        </NavLink>
      </li>
      <li>
        <NavLink to="/my-booking" className="hover:text-primary flex items-center gap-2">
          <FaBookOpen />
          My Bookiings
        </NavLink>
      </li>
     
    
    </>
  );

  return (
    <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 shadow-md">
      
      {user && (
        <div className="flex justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 animate__animated animate__fadeIn">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold animate__bounce text-center">
            WELCOME, <span className="text-yellow-300">{user.displayName}</span>! 🎉
          </h2>
        </div>
      )}

      <div className="navbar bg-base-100 w-full px-4 lg:w-11/12 mx-auto py-4">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] w-52 bg-base-100 rounded-box shadow animate__animated animate__fadeIn"
            >
              {links}
            </ul>
          </div>
          <Link to="/" className="flex items-center">
            <img className="w-12 h-auto" src={logo} alt="Logo" />
            <span className="text-xl font-semibold ml-2 text-white">Brand</span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-4">{links}</ul>
        </div>

        <div className="navbar-end">
          {user ? (
            <div className="flex items-center space-x-4 animate__animated animate__fadeIn animate__delay-2s">
              <img
                className="w-10 h-10 rounded-full border-2 border-primary shadow-md hover:scale-105 transform transition-all"
                src={user.photoURL}
                alt={user.displayName}
              />
              <button
                onClick={handleSignOut}
                className="btn btn-outline btn-primary flex items-center gap-2 hover:scale-110 transform transition-all"
              >
                <FaSignOutAlt />
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary flex items-center gap-2 hover:scale-110 transform transition-all">
              <FaUser />
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
