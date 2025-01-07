import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaRegComments } from 'react-icons/fa';
import { motion } from 'framer-motion';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchRooms = () => {
    const queryParams = new URLSearchParams({
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
    }).toString();

    fetch(`https://hotel-server-flax.vercel.app/rooms?${queryParams}`)
      .then(response => response.json())
      .then(data => setRooms(data))
      .catch(err => console.error('Error fetching rooms:', err));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-white">Our Rooms</h1>

      {/* Price Filter Section */}
      <motion.form
        className="mb-8 flex flex-col sm:flex-row items-center gap-6 bg-gray-100 p-6 rounded-lg shadow-md"
        onSubmit={handleFilterSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        <motion.button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Filter
        </motion.button>
      </motion.form>

      {/* Rooms Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <motion.div
            key={room._id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform transition-transform hover:scale-105"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to={`/rooms/${room._id}`}>
              <img
                src={room.images}
                alt={room.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-800">{room.name}</h2>
                <div className="flex items-center text-yellow-500">
                  <FaStar className="mr-1" />
                  <span>{room.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{room.description}</p>
              <p className="text-lg font-bold text-green-600 mb-2">
                {room.price} USD/night
              </p>
              <div className="flex items-center justify-between text-gray-400 text-sm">
                <div className="flex items-center">
                  <FaRegComments className="mr-1" />
                  <span>
                    {room.reviewsCnt} {room.reviewsCnt === 1 ? 'Review' : 'Reviews'}
                  </span>
                </div>
                <span className="text-blue-500">View Details</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;
