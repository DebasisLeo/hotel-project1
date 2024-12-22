import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AuthContext } from './AuthProvider';
 // Import AuthContext

const RoomDetailsPage = () => {
  const { roomId } = useParams();
  const { user, loading } = useContext(AuthContext); // Get the user from AuthContext
  const [room, setRoom] = useState(null);
  const [bookingDate, setBookingDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [singleBookingDate, setSingleBookingDate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/rooms/${roomId}`)
      .then(response => response.json())
      .then(data => setRoom(data))
      .catch(err => setError(err.message));
  }, [roomId]);

  const handleBooking = () => {
    if (!room.isAvailable) {
      alert('This room is no longer available for booking.');
      return;
    }
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (!user) {
      alert('Please log in to book this room');
      return;
    }

    const userDetails = {
     
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };

    fetch(`http://localhost:3000/rooms/${roomId}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingDate: singleBookingDate || bookingDate,
        checkOutDate,
        user: userDetails, // Send user details
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Room booked successfully!') {
          alert('Booking successful!');
          setShowBookingModal(false);
          setRoom({ ...room, isAvailable: false }); // Update room availability in UI
        } else {
          alert('Booking failed: ' + data.message);
        }
      })
      .catch(err => alert('Booking failed: ' + err.message));
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!room || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <img src={room.images} alt={room.name} className="w-full h-72 object-cover rounded-lg mb-4" />
          <h1 className="text-3xl font-bold mb-4">{room.name}</h1>
          <p className="text-lg mb-4">{room.description}</p>
          <p className="text-xl font-semibold mb-4">{room.price} USD/night</p>

          <div className="mb-4">
            <h3 className="text-xl font-semibold">Select Booking Dates</h3>
            <DatePicker
              selected={bookingDate}
              onChange={date => setBookingDate(date)}
              minDate={new Date()}
              className="border p-2 rounded mr-4"
              placeholderText="Check-in Date"
            />
            <DatePicker
              selected={checkOutDate}
              onChange={date => setCheckOutDate(date)}
              minDate={bookingDate || new Date()}
              className="border p-2 rounded"
              placeholderText="Check-out Date"
            />
          </div>

          <button
            onClick={handleBooking}
            className={`bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full hover:bg-blue-700 ${!room.isAvailable ? 'bg-gray-500 cursor-not-allowed' : ''}`}
            disabled={!room.isAvailable}
          >
            {room.isAvailable ? 'Book Now' : 'Room Unavailable'}
          </button>
        </div>
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 mx-auto">
            <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
            <p><strong>Room:</strong> {room.name}</p>
            <p><strong>Price:</strong> {room.price} USD/night</p>
            <p><strong>Check-in Date:</strong> {bookingDate ? bookingDate.toLocaleDateString() : 'N/A'}</p>
            <p><strong>Check-out Date:</strong> {checkOutDate ? checkOutDate.toLocaleDateString() : 'N/A'}</p>
            <p><strong>Total Price:</strong> {room.price} USD</p>
            <h3 className="text-lg font-semibold mt-4">Single-Day Booking</h3>
            <DatePicker
              selected={singleBookingDate}
              onChange={date => setSingleBookingDate(date)}
              minDate={new Date()}
              className="border p-2 rounded"
              placeholderText="Select Single Day"
            />
            <button className="bg-green-500 text-white py-2 px-4 rounded mt-4 w-full hover:bg-green-700" onClick={confirmBooking}>
              Confirm Booking
            </button>
            <button className="bg-red-500 text-white py-2 px-4 rounded mt-4 w-full hover:bg-red-700" onClick={() => setShowBookingModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetailsPage;