import React from 'react';
import { Helmet } from 'react-helmet';  
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const Root = () => {
  return (
    <div className='w-11/12 mx-auto bg-gradient-to-r from-gray-800 to-cyan-200'>
      
      <Helmet>
        <title>My LuxStay Hotel</title>
        <meta name="description" content="Book the best rooms at My LuxStay Hotel. Enjoy your stay!" />
        <meta name="keywords" content="hotel, rooms, booking, luxury" />
        <meta name="author" content="My LuxStay" />
      </Helmet>

      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Root;
