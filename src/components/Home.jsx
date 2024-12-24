import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typewriter } from 'react-simple-typewriter';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaStar } from 'react-icons/fa';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';
import banner4 from '../assets/banner4.png';
import offers from '../assets/offers.jpg';
import g from '../assets/g.png';
import { motion } from 'framer-motion';
import { FaDollarSign } from 'react-icons/fa';
import { MdOutlineBedroomParent } from 'react-icons/md';
import { FiArrowRightCircle } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Slider from 'react-slick';
import { FaWifi, FaSwimmingPool, FaSpa, FaBed } from 'react-icons/fa';

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Fetch room data and reviews from the backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('https://hotel-server-flax.vercel.app/rooms');
        const data = await response.json();
        setFeaturedRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    const fetchAllReviews = async () => {
      try {
        const response = await fetch('https://hotel-server-flax.vercel.app/reviews');
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchRooms();
    fetchAllReviews(); 

    AOS.init({ duration: 1000 });
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Convert UTC date to Bangladesh time (BST)
  const convertToBDTime = (utcDate) => {
    const date = new Date(utcDate);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Dhaka',
    };
    return date.toLocaleString('en-GB', options);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  return (
    <div className="font-sans">
     
     {/* Typewriter Text */}
<div 
  className="mb-8 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-center" 
  data-aos="fade-up"
>
  <Typewriter
    words={[
      'Hey,Welcome to LuxStay Hotels',
      'Book Your Dream Room Today',
      'Luxury. Comfort. Convenience.'
    ]}
    loop={true}
    cursor
    cursorStyle="|"
    typeSpeed={80}
    deleteSpeed={50}
    delaySpeed={1500}
  />
</div>



      {/* Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <motion.div
      className="bg-white rounded-lg shadow-lg p-8 w-11/12 max-w-lg text-center relative transform transition-all duration-300 ease-in-out hover:scale-105"
      style={{
        backgroundImage: `url(${g})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '12px',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-3xl font-bold"
      >
        &times;
      </button>
      <div className="text-center p-4">
        {/* Header with highlight animation */}
        <motion.h2
          className="text-3xl font-bold mb-4 text-white shadow-md p-2 inline-block bg-opacity-60 bg-black rounded-md"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Special Offers & Promotions
        </motion.h2>
        
        {/* Description Text with Highlighted "50% off" */}
        <motion.p
          className="text-lg text-white shadow-md mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Enjoy up to{' '}
          <motion.span
            className="font-bold text-yellow-400"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            50% off
          </motion.span>{' '}
          on selected rooms! Book your stay now and experience luxury at an unbeatable price.
        </motion.p>

        {/* Button with Hover Animation */}
        <motion.button
          onClick={closeModal}
          className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 ease-in-out transform hover:scale-110"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Offers
        </motion.button>
      </div>
    </motion.div>
  </div>
)}


{/* Special Offers Section */}
<section
  className="relative bg-cover bg-center h-[500px] mb-7"
  style={{ backgroundImage: `url(${offers})` }}
>
  <motion.div
    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <div className="text-white px-8 md:px-16">
      {/* Animated Heading */}
      <motion.h2
        className="text-4xl font-bold mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Exclusive Offers Just for You!
      </motion.h2>

      {/* Animated Paragraph */}
      <motion.p
        className="text-lg mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Save up to 50% on your next stay. Don't miss out on this limited-time offer!
      </motion.p>

      {/* Animated Button */}
      <motion.a
        href="#offers"
        className="px-8 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 ease-in-out"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        Book Now
      </motion.a>
    </div>
  </motion.div>
</section>

      {/* Banner Section with Slider */}
      <div className="carousel w-full relative">
  {/* Slide 1 */}
  <div id="slide1" className="carousel-item relative w-full">
    <img src={banner1} className="w-full" alt="Banner 1" />
    <div className="absolute left-5 right-5 top-1/2 transform -translate-y-1/2 flex justify-between text-white">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Welcome to Our Hotel</h2>
        <p className="mb-6 text-lg">Experience luxury and comfort like never before. Explore our rooms and book your stay today.</p>
        <Link to='/rooms' className="btn bg-red-500 text-white rounded-full hover:bg-red-600 transition px-6 py-3">
          Explore Rooms
        </Link>
      </div>
      <div>
        <a href="#slide4" className="btn btn-circle text-white">❮</a>
        <a href="#slide2" className="btn btn-circle text-white">❯</a>
      </div>
    </div>
  </div>

  {/* Slide 2 */}
  <div id="slide2" className="carousel-item relative w-full">
    <img src={banner2} className="w-full" alt="Banner 2" />
    <div className="absolute left-5 right-5 top-1/2 transform -translate-y-1/2 flex justify-between text-white">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Discover Your Perfect Stay</h2>
        <p className="mb-6 text-lg">Relax and unwind in our elegant rooms, designed with your comfort in mind.</p>
        <Link to='/rooms' className="btn bg-red-500 text-white rounded-full hover:bg-red-600 transition px-6 py-3">
          Explore Rooms
        </Link>
      </div>
      <div>
        <a href="#slide1" className="btn btn-circle text-white">❮</a>
        <a href="#slide3" className="btn btn-circle text-white">❯</a>
      </div>
    </div>
  </div>

  {/* Slide 3 */}
  <div id="slide3" className="carousel-item relative w-full">
    <img src={banner3} className="w-full" alt="Banner 3" />
    <div className="absolute left-5 right-5 top-1/2 transform -translate-y-1/2 flex justify-between text-white">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Luxury Awaits You</h2>
        <p className="mb-6 text-lg">Indulge in the finest amenities and service during your stay at our hotel.</p>
        <Link to='/rooms' className="btn bg-red-500 text-white rounded-full hover:bg-red-600 transition px-6 py-3">
          Explore Rooms
        </Link>
      </div>
      <div>
        <a href="#slide2" className="btn btn-circle text-white">❮</a>
        <a href="#slide4" className="btn btn-circle text-white">❯</a>
      </div>
    </div>
  </div>

  {/* Slide 4 */}
  <div id="slide4" className="carousel-item relative w-full">
    <img src={banner4} className="w-full" alt="Banner 4" />
    <div className="absolute left-5 right-5 top-1/2 transform -translate-y-1/2 flex justify-between text-white">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Unforgettable Experiences</h2>
        <p className="mb-6 text-lg">Let us take care of every detail of your stay. You deserve the best.</p>
        <Link to='/rooms' className="btn bg-red-500 text-white rounded-full hover:bg-red-600 transition px-6 py-3">
          Explore Rooms
        </Link>n
      </div>
      <div>
        <a href="#slide3" className="btn btn-circle text-white">❮</a>
        <a href="#slide1" className="btn btn-circle text-white">❯</a>
      </div>
    </div>
  </div>
</div>


      {/* Map Section */}
      <section className="py-10 px-4">
        <h2 className="text-2xl font-bold text-center mb-6">Find Us Here</h2>
        <div className="w-full h-[400px]">
          <iframe
            title="Hotel Location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-0.125,%2051.49,%20-0.1,%2051.51&layer=mapnik"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="py-10 px-4 bg-gray-100">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Featured Rooms</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {featuredRooms.slice(0, 6).map((room) => (
          <div
            key={room.id}
            className="border rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition-transform transform hover:-translate-y-2"
            data-aos="fade-up"
          >
            <img
              src={room.images}
              alt={room.name}
              className="w-full h-52 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-3 text-gray-700">
                <MdOutlineBedroomParent className="text-blue-500" /> {room.name}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">{room.description}</p>
              <p className="text-green-600 font-bold text-lg flex items-center gap-1 mb-5">
                <FaDollarSign /> {room.price}
              </p>
              <Link
                to={`/rooms/${room._id}`}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
              >
                Book Now <FiArrowRightCircle />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>

      {/* Testimonial Carousel */}
      <section className="py-10 px-4 bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-6">Guest Reviews</h2>
        <div className="max-w-4xl mx-auto">
        <Slider {...sliderSettings}>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div
            key={review._id}
            className="px-8 py-10 bg-gradient-to-br from-purple-50 via-indigo-100 to-pink-50 rounded-2xl shadow-2xl transform transition-all hover:scale-105 duration-300"
          >
            <p className="text-gray-900 text-xl font-medium italic mb-4">“{review?.comment}”</p>
            <p className="text-gray-500 text-sm mb-6">{convertToBDTime(review?.createdAt)}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-indigo-600">{review.user}</span>
              <span className="flex items-center text-yellow-400">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <FaStar key={index} className="text-xl" />
                ))}
              </span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600 text-lg font-medium">No reviews yet.</p>
      )}
    </Slider>
        </div>
      </section>

      {/* Luxury Amenities Section */}
      <section className="py-10 bg-blue-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Experience Luxury Amenities</h2>
          <p className="mb-6 text-lg">Indulge in our premium facilities that elevate your stay. Whether it's a relaxing spa day, an invigorating swim, or uninterrupted Wi-Fi access, we have everything for your comfort.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <FaWifi className="text-4xl mb-2" />
              <p>Free Wi-Fi</p>
            </div>
            <div className="flex flex-col items-center">
              <FaSwimmingPool className="text-4xl mb-2" />
              <p>Swimming Pool</p>
            </div>
            <div className="flex flex-col items-center">
              <FaSpa className="text-4xl mb-2" />
              <p>Spa Services</p>
            </div>
            <div className="flex flex-col items-center">
              <FaBed className="text-4xl mb-2" />
              <p>Comfortable Rooms</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Satisfaction Section */}
      <section className="py-10 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Our Customer Satisfaction</h2>
          <p className="mb-6 text-lg">With over 500+ happy guests, we strive to provide the best experiences possible. Our staff is dedicated to making your stay unforgettable.</p>
          <div className="flex justify-center">
            <div className="flex items-center space-x-4">
              <p className="text-4xl font-bold text-blue-500">4.8</p>
              <div className="flex items-center text-yellow-500">
                {'⭐'.repeat(5)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
