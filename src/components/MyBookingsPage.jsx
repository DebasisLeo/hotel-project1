import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AuthContext } from './AuthProvider';
import { FaRegEdit, FaTrashAlt, FaStar } from 'react-icons/fa'; // Importing React icons
import { motion } from 'framer-motion';
import Swal from 'sweetalert2'; // Import SweetAlert2

const MyBookingsPage = () => {
  const { user } = useContext(AuthContext); 
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]); 
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdateDateModal, setShowUpdateDateModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newBookingDate, setNewBookingDate] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 1, comment: '' });

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3000/bookings?userEmail=${user.email}`)
        .then((response) => response.json())
        .then((data) => {
          setBookings(data);
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
        Swal.fire('Success', 'Booking canceled successfully', 'success'); // SweetAlert success
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
      Swal.fire('Error', 'Please select a new date.', 'error'); // SweetAlert error
      return;
    }
    if (newBookingDate < new Date()) {
      Swal.fire('Error', 'The selected date cannot be in the past.', 'error'); // SweetAlert error
      return;
    }

    fetch(`http://localhost:3000/bookings/${selectedBooking}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingDate: newBookingDate }),
    })
      .then(() => {
        Swal.fire('Success', 'Booking date updated successfully', 'success'); // SweetAlert success
        setBookings(bookings.map((booking) =>
          booking._id === selectedBooking ? { ...booking, bookingDate: newBookingDate } : booking
        ));
        setShowUpdateDateModal(false);
      });
  };

  const handleReviewModal = (bookingId) => {
    const booking = bookings.find((booking) => booking._id === bookingId);
    setSelectedBooking(bookingId);
    setReviewData({ rating: 1, comment: '' });
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
      Swal.fire('Error', 'Please fill out all fields', 'error'); // SweetAlert error
      return;
    }
    
    const selectedRoom = bookings.find((booking) => booking._id === selectedBooking);
    if (!selectedRoom) {
      Swal.fire('Error', 'Booking not found', 'error'); // SweetAlert error
      return;
    }
    
    const roomId = selectedRoom.roomId;  
    
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
          Swal.fire('Success', 'Review submitted successfully', 'success'); // SweetAlert success
          setShowReviewModal(false);
        } else {
          Swal.fire('Error', data.message, 'error'); // SweetAlert error
        }
      })
      .catch((error) => {
        console.error('Error submitting review:', error);
        Swal.fire('Error', 'Error submitting review. Please try again.', 'error'); // SweetAlert error
      });
  };

  if (!user) return <div>Please log in to view your bookings.</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.h1 
        className="text-3xl font-bold mb-4 text-center text-indigo-600"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Bookings
      </motion.h1>

      {bookings.length === 0 ? <p>You have no bookings.</p> : (
        <table className="table-auto w-full border-collapse">
          <thead className="bg-gray-100">
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
                <motion.tr 
                  key={booking._id} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ duration: 0.5 }}
                >
                  <td className="border-b px-4 py-2">
                    {room ? (
                      <>
                        <img
                          src={room.images}
                          alt={room.name}
                          className="w-16 h-16 object-cover rounded-full"
                        />
                        <span className="ml-2  font-bold">{room.name}</span>
                      </>
                    ) : <p>Loading...</p>}
                  </td>
                  <td className="border-b px-4 py-2 font-bold">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td className="border-b px-4 py-2 font-bold">{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                  <td className="border-b px-4 py-2 font-bold">${room ? room.price : 'Loading...'}</td>
                  <td className="border-b px-4 py-2 flex space-x-3">
                    <button onClick={() => handleCancelBooking(booking._id)} className="bg-red-500 text-white py-2 px-4 rounded-full flex items-center space-x-2">
                      <FaTrashAlt />
                      <span>Cancel</span>
                    </button>
                    <button onClick={() => handleUpdateDate(booking._id)} className="bg-yellow-500 text-white py-2 px-4 rounded-full flex items-center space-x-2">
                      <FaRegEdit />
                      <span>Update</span>
                    </button>
                    <button onClick={() => handleReviewModal(booking._id)} className="bg-blue-500 text-white py-2 px-4 rounded-full flex items-center space-x-2">
                      <FaStar />
                      <span>Review</span>
                    </button>
                  </td>
                </motion.tr>
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
            <h2 className="text-xl font-bold mb-4">Select New Booking Date</h2>
            <DatePicker 
              selected={newBookingDate} 
              onChange={(date) => setNewBookingDate(date)} 
              minDate={new Date()} 
              className="w-full border px-4 py-2 rounded mb-4"
            />
            <button onClick={confirmUpdateDate} className="bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full">
              Update Date
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
            <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
            <div className="mb-4">
              <label htmlFor="rating" className="block mb-2">Rating</label>
              <select
                name="rating"
                id="rating"
                value={reviewData.rating}
                onChange={handleReviewChange}
                className="w-full border px-4 py-2 rounded"
              >
                {[1, 2, 3, 4, 5].map((rate) => (
                  <option key={rate} value={rate}>{rate}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="comment" className="block mb-2">Comment</label>
              <textarea
                name="comment"
                id="comment"
                value={reviewData.comment}
                onChange={handleReviewChange}
                className="w-full border px-4 py-2 rounded"
                rows="4"
              ></textarea>
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
