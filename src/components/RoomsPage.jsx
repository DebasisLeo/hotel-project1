import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
          <Link to={`/rooms/${room._id}`} key={room.id} className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
            <img src={room.images} alt={room.name} className="w-full h-56 object-cover rounded-lg mb-4" />
            <h2 className="text-xl font-semibold">{room.name}</h2>
            <p className="text-gray-500">{room.description}</p>
            <p className="text-lg font-bold mt-2">{room.price} USD/night</p>
            <div className="flex items-center mt-2">
              <span className="text-yellow-500">⭐ {room.rating}</span>
            </div>
            <p className="text-gray-400 mt-2">
              {room.reviewsCount} {room.reviewsCount === 1 ? 'Review' : 'Reviews'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;
