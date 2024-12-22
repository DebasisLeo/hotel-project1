import React, { useEffect } from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa'; // Importing React Icons
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles

const Footer = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: 'ease-in-out',
    });
  }, []);

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Column 1: About Us */}
          <div className="space-y-4" data-aos="fade-up">
            <h3 className="text-2xl font-bold">About Us</h3>
            <p className="text-gray-400">
              We offer exceptional hospitality and an unforgettable experience in every stay. Explore the world with us.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4" data-aos="fade-up">
            <h3 className="text-2xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-red-500 transition">Home</Link>
              </li>
              <li>
                <Link to="/rooms" className="hover:text-red-500 transition">Rooms</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-red-500 transition">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-red-500 transition">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-4" data-aos="fade-up">
            <h3 className="text-2xl font-bold">Contact Us</h3>
            <ul className="space-y-2">
              <li>Email: <a href="mailto:info@hotel.com" className="hover:text-red-500 transition">info@hotel.com</a></li>
              <li>Phone: <a href="tel:+1234567890" className="hover:text-red-500 transition">+1 (234) 567-890</a></li>
              <li>Address: 123 Luxury St, Miami, USA</li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div className="space-y-4" data-aos="fade-up">
            <h3 className="text-2xl font-bold">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition">
                <FaFacebookF size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition">
                <FaInstagram size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition">
                <FaTwitter size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-800 transition">
                <FaLinkedinIn size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-gray-600 pt-4 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 Luxury Hotel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
