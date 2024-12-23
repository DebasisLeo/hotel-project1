import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaRegComments } from 'react-icons/fa';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/rooms')
      .then(response => response.json())
      .then(data => setRooms(data))
      .catch(err => console.error('Error fetching rooms:', err));
  }, []);

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Rooms</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {rooms.map(room => (
          <Link to={`/rooms/${room._id}`} key={room._id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transform transition-transform hover:scale-105">
            <img src={room.images} alt={room.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-gray-800">{room.name}</h2>
              <div className="flex items-center text-yellow-500">
                <FaStar className="mr-1" />
                <span>{room.rating}</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">{room.description}</p>
            <p className="text-lg font-bold text-green-600 mb-2">{room.price} USD/night</p>
            <div className="flex items-center justify-between text-gray-400 text-sm">
              <div className="flex items-center">
                <FaRegComments className="mr-1" />
                <span>{room.reviewsCnt} {room.reviewsCnt === 1 ? 'Review' : 'Reviews'}</span>
              </div>
              <span className="text-blue-500">View Details</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;
