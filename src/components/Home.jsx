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

  return (
    <div className="font-sans">
      {/* Banner Section with Slider */}
      <div className="carousel w-full">
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
  <div id="slide2" className="carousel-item relative w-full">
    <img src={banner2} className="w-full" />
    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between text-white">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Your Perfect Stay Awaits</h2>
        <p className="mb-6 text-lg">Indulge in ultimate comfort and luxury during your stay with us. Book now to enjoy a special experience.</p>
        <a href="#rooms" className="btn bg-red-500 text-white rounded-full hover:bg-red-600 transition px-6 py-3">
          Explore Rooms
        </a>
      </div>
      <div>
        <a href="#slide1" className="btn btn-circle">❮</a>
        <a href="#slide3" className="btn btn-circle">❯</a>
      </div>
    </div>
  </div>
  <div id="slide3" className="carousel-item relative w-full">
    <img src={banner3} className="w-full" />
    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between text-white">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Luxury at Its Best</h2>
        <p className="mb-6 text-lg">Relax in style and enjoy the finest amenities. A perfect stay for every guest.</p>
        <a href="#rooms" className="btn bg-red-500 text-white rounded-full hover:bg-red-600 transition px-6 py-3">
          Explore Rooms
        </a>
      </div>
      <div>
        <a href="#slide2" className="btn btn-circle">❮</a>
        <a href="#slide4" className="btn btn-circle">❯</a>
      </div>
    </div>
  </div>
  <div id="slide4" className="carousel-item relative w-full">
    <img src={banner4} className="w-full" />
    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between text-white">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">An Unforgettable Experience</h2>
        <p className="mb-6 text-lg">Make memories that last with our exceptional service and stunning rooms.</p>
        <a href="#rooms" className="btn bg-red-500 text-white rounded-full hover:bg-red-600 transition px-6 py-3">
          Explore Rooms
        </a>
      </div>
      <div>
        <a href="#slide3" className="btn btn-circle">❮</a>
        <a href="#slide1" className="btn btn-circle">❯</a>
      </div>
    </div>
  </div>
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

      {/* Amenities Section */}
      <section className="py-10 px-4 bg-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6">Our Amenities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center" data-aos="zoom-in">
            <FaWifi className="text-4xl text-blue-500 mb-4" />
            <h3 className="text-xl font-bold">Free Wi-Fi</h3>
            <p>Stay connected with high-speed internet.</p>
          </div>
          <div className="flex flex-col items-center text-center" data-aos="zoom-in" data-aos-delay="100">
            <FaSwimmingPool className="text-4xl text-blue-500 mb-4" />
            <h3 className="text-xl font-bold">Swimming Pool</h3>
            <p>Relax and unwind in our luxurious pool.</p>
          </div>
          <div className="flex flex-col items-center text-center" data-aos="zoom-in" data-aos-delay="200">
            <FaSpa className="text-4xl text-blue-500 mb-4" />
            <h3 className="text-xl font-bold">Spa & Wellness</h3>
            <p>Rejuvenate your body and mind with our spa services.</p>
          </div>
          <div className="flex flex-col items-center text-center" data-aos="zoom-in" data-aos-delay="300">
            <FaBed className="text-4xl text-blue-500 mb-4" />
            <h3 className="text-xl font-bold">Comfortable Beds</h3>
            <p>Enjoy a peaceful night's sleep in our cozy beds.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 px-4">
        <h2 className="text-2xl font-bold text-center mb-6">What Our Guests Say</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="bg-white shadow-lg p-6 rounded-lg w-72" data-aos="fade-up">
            <p className="text-gray-700 mb-4">"The best hotel experience I've ever had! The staff was incredibly friendly, and the amenities were top-notch."</p>
            <p className="font-semibold text-lg">John Doe</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg w-72" data-aos="fade-up" data-aos-delay="100">
            <p className="text-gray-700 mb-4">"Absolutely fantastic stay! The rooms were beautiful, and the service was impeccable."</p>
            <p className="font-semibold text-lg">Jane Smith</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg w-72" data-aos="fade-up" data-aos-delay="200">
            <p className="text-gray-700 mb-4">"A memorable experience! Will definitely be back for another stay. Highly recommend it."</p>
            <p className="font-semibold text-lg">Samuel Lee</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
