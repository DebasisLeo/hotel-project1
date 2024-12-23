import React from 'react';
import { Helmet } from 'react-helmet';  // Import Helmet
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const Root = () => {
  return (
    <div className='w-11/12 mx-auto'>
      {/* Helmet to update the title and meta tags globally */}
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
