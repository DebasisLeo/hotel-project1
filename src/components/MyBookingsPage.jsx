import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AuthContext } from './AuthProvider';

const MyBookingsPage = () => {
  const { user } = useContext(AuthContext); 
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]); 
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdateDateModal, setShowUpdateDateModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false); // Show review modal
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newBookingDate, setNewBookingDate] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 1, comment: '' }); // New review state

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3000/bookings?userEmail=${user.email}`)
        .then((response) => response.json())
        .then((data) => {
          setBookings(data);

          // Fetch room data for each booking
          data.forEach((booking) => {
            fetch(`http://localhost:3000/rooms/${booking.roomId}`)
              .then((response) => response.json())
              .then((roomData) => {
                setRooms((prevRooms) => [
                  ...prevRooms,
                  { roomId: booking.roomId, ...roomData },
                ]);
              });
          });
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  const handleCancelBooking = (bookingId) => {
    setSelectedBooking(bookingId);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = () => {
    fetch(`http://localhost:3000/bookings/${selectedBooking}/cancel`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        alert('Booking canceled successfully');
        setBookings(bookings.filter((booking) => booking._id !== selectedBooking));
        setShowCancelModal(false);
      });
  };

  const handleUpdateDate = (bookingId) => {
    setSelectedBooking(bookingId);
    setShowUpdateDateModal(true);
  };

  const confirmUpdateDate = () => {
    if (!newBookingDate) {
      alert('Please select a new date.');
      return;
    }
    if (newBookingDate < new Date()) {
      alert('The selected date cannot be in the past.');
      return;
    }

    fetch(`http://localhost:3000/bookings/${selectedBooking}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingDate: newBookingDate }),
    })
      .then(() => {
        alert('Booking date updated successfully');
        setBookings(bookings.map((booking) =>
          booking._id === selectedBooking ? { ...booking, bookingDate: newBookingDate } : booking
        ));
        setShowUpdateDateModal(false);
      });
  };

  const handleReviewModal = (bookingId) => {
    const booking = bookings.find((booking) => booking._id === bookingId);
    setSelectedBooking(bookingId);
    setReviewData({ rating: 1, comment: '' }); // Reset review data
    setShowReviewModal(true);
  };
  

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitReview = () => {
    const { rating, comment } = reviewData;
    
    if (!rating || !comment) {
      alert('Please fill out all fields');
      return;
    }
    
    // Get the roomId from the selected booking
    const selectedRoom = bookings.find((booking) => booking._id === selectedBooking);
    if (!selectedRoom) {
      alert('Booking not found');
      return;
    }
    
    const roomId = selectedRoom.roomId;  // Get roomId from the selected booking
    
    // Send the review to the backend for the specified room
    fetch(`http://localhost:3000/rooms/${roomId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: user.email,
        rating,
        comment,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Review added successfully') {
          alert('Review submitted successfully');
          setShowReviewModal(false);
          // Optionally, reload bookings or reviews data here.
        } else {
          alert(data.message); // Handle any errors
        }
      })
      .catch((error) => {
        console.error('Error submitting review:', error);
        alert('Error submitting review. Please try again.');
      });
  };
  
  

  if (!user) return <div>Please log in to view your bookings.</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">My Bookings</h1>

      {bookings.length === 0 ? <p>You have no bookings.</p> : (
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b px-4 py-2">Room</th>
              <th className="border-b px-4 py-2">Booking Date</th>
              <th className="border-b px-4 py-2">Check-out Date</th>
              <th className="border-b px-4 py-2">Price</th>
              <th className="border-b px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const room = rooms.find((room) => room.roomId === booking.roomId);

              return (
                <tr key={booking._id}>
                  <td className="border-b px-4 py-2">
                    {room ? (
                      <>
                        <img
                          src={room.images}
                          alt={room.name}
                          className="w-16 h-16 object-cover"
                        />
                        <span>{room.name}</span>
                      </>
                    ) : <p>Loading...</p>}
                  </td>
                  <td className="border-b px-4 py-2">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td className="border-b px-4 py-2">{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                  <td className="border-b px-4 py-2">${room ? room.price : 'Loading...'}</td>
                  <td className="border-b px-4 py-2">
                    <button onClick={() => handleCancelBooking(booking._id)} className="bg-red-500 text-white py-2 px-4 rounded">
                      Cancel Booking
                    </button>
                    <button onClick={() => handleUpdateDate(booking._id)} className="bg-yellow-500 text-white py-2 px-4 rounded ml-2">
                      Update Date
                    </button>
                    <button onClick={() => handleReviewModal(booking._id)} className="bg-blue-500 text-white py-2 px-4 rounded ml-2">
                      Give Review
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 mx-auto">
            <h2 className="text-xl font-bold mb-4">Confirm Booking Cancellation</h2>
            <p>Are you sure you want to cancel this booking?</p>
            <button onClick={confirmCancelBooking} className="bg-green-500 text-white py-2 px-4 rounded mt-4 w-full">
              Yes, Cancel Booking
            </button>
            <button onClick={() => setShowCancelModal(false)} className="bg-red-500 text-white py-2 px-4 rounded mt-4 w-full">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Update Date Modal */}
      {showUpdateDateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 mx-auto">
            <h2 className="text-xl font-bold mb-4">Update Booking Date</h2>
            <DatePicker selected={newBookingDate} onChange={setNewBookingDate} minDate={new Date()} className="border p-2 rounded" />
            <button onClick={confirmUpdateDate} className="bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full">
              Confirm Update
            </button>
            <button onClick={() => setShowUpdateDateModal(false)} className="bg-red-500 text-white py-2 px-4 rounded mt-4 w-full">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 mx-auto">
            <h2 className="text-xl font-bold mb-4">Write a Review</h2>
            <div>
              <label className="block mb-2">Username:</label>
              <input
                type="text"
                value={user.email}
                readOnly
                className="border p-2 rounded w-full bg-gray-100"
              />
            </div>
            <div>
              <label className="block mb-2">Rating (1 to 5):</label>
              <input
                type="number"
                name="rating"
                value={reviewData.rating}
                onChange={handleReviewChange}
                min="1"
                max="5"
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2">Comment:</label>
              <textarea
                name="comment"
                value={reviewData.comment}
                onChange={handleReviewChange}
                className="border p-2 rounded w-full"
                rows="4"
              />
            </div>
            <button onClick={submitReview} className="bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full">
              Submit Review
            </button>
            <button onClick={() => setShowReviewModal(false)} className="bg-red-500 text-white py-2 px-4 rounded mt-4 w-full">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
