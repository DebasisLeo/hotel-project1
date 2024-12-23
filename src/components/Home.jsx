import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaWifi, FaSwimmingPool, FaSpa, FaBed } from 'react-icons/fa'; // React Icons
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import banner1 from '../assets/banner1.png'; // Add multiple banners for slider
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';
import banner4 from '../assets/banner4.png';
import 'leaflet/dist/leaflet.css';
import AOS from 'aos'; // Importing AOS for animations
import 'aos/dist/aos.css'; // Importing AOS styles

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true); // State for modal visibility

  // Fetch data from the backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:3000/rooms');
        const data = await response.json();
        setFeaturedRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();

    // Initialize AOS
    AOS.init({ duration: 1000 });
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="font-sans">
      {/* Popup Modal for Special Offers */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg text-center relative">
            <h2 className="text-2xl font-bold mb-4 text-red-500">Special Offers & Promotions</h2>
            <p className="text-gray-700 mb-6">
              Enjoy up to <span className="font-bold">50% off</span> on selected rooms! Book your stay now and experience luxury at an unbeatable price.
            </p>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl font-bold"
            >
              &times;
            </button>
            <button
              onClick={closeModal}
              className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            >
              Explore Offers
            </button>
          </div>
        </div>
      )}

      {/* Banner Section with Slider */}
      <div className="carousel w-full">
        {/* Slides */}
        {/* Slide1 */}
        <div id="slide1" className="carousel-item relative w-full">
          <img src={banner1} className="w-full" />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between text-white">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">Welcome to Our Hotel</h2>
              <p className="mb-6 text-lg">Experience luxury and comfort like never before. Explore our rooms and book your stay today.</p>
              <a href="#rooms" className="btn bg-red-500 text-white rounded-full hover:bg-red-600 transition px-6 py-3">
                Explore Rooms
              </a>
            </div>
            <div>
              <a href="#slide4" className="btn btn-circle">❮</a>
              <a href="#slide2" className="btn btn-circle">❯</a>
            </div>
          </div>
        </div>
        {/* Additional slides here */}
      </div>

      {/* Map Section with iframe */}
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
      <section className="py-10 px-4">
        <h2 className="text-2xl font-bold text-center mb-6">Featured Rooms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredRooms.slice(0, 6).map((room) => (
            <div key={room.id} className="border rounded-lg shadow-md overflow-hidden" data-aos="fade-up">
              <img src={room.images} alt={room.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                <p className="text-gray-700 mb-4">{room.description}</p>
                <p className="text-green-600 font-bold mb-4">{room.price}</p>
                <Link to={`/rooms/${room.id}`} className="block text-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Other sections like Amenities and Testimonials */}
    </div>
  );
};

export default Home;
