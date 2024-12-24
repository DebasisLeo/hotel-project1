import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AuthContext } from './AuthProvider';
import { FaRegEdit, FaTrashAlt, FaStar } from 'react-icons/fa'; 
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import axios from 'axios'; 

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
      axios(`http://localhost:3000/bookings?userEmail=${user.email}`,{withCredentials:true})
        .then(res => {
          setBookings(res.data);
          // Fetch room data for each booking
          res.data.forEach((booking) => {
            axios(`http://localhost:3000/rooms/${booking.roomId}`)
              .then((response) => {
                setRooms((prevRooms) => [
                  ...prevRooms,
                  { roomId: booking.roomId, ...response.data },
                ]);
              })
              .catch((err) => {
                console.error('Error fetching room data:', err);
              });
          });
        })
        .catch((err) => {
          console.error('Error fetching bookings:', err);
        });
    }
  }, [user]);

  const handleCancelBooking = (bookingId) => {
    setSelectedBooking(bookingId);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = () => {
    axios.delete(`http://localhost:3000/bookings/${selectedBooking}/cancel`)
      .then(() => {
        Swal.fire('Success', 'Booking canceled successfully', 'success'); // SweetAlert success
        setBookings(bookings.filter((booking) => booking._id !== selectedBooking));
        setShowCancelModal(false);
      })
      .catch(err => {
        Swal.fire('Error', 'Error canceling booking. Please try again.', 'error'); // SweetAlert error
        console.error(err);
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

    axios.put(`http://localhost:3000/bookings/${selectedBooking}/update`, {
      bookingDate: newBookingDate,
    })
      .then(() => {
        Swal.fire('Success', 'Booking date updated successfully', 'success'); // SweetAlert success
        setBookings(bookings.map((booking) =>
          booking._id === selectedBooking ? { ...booking, bookingDate: newBookingDate } : booking
        ));
        setShowUpdateDateModal(false);
      })
      .catch(err => {
        Swal.fire('Error', 'Error updating booking date. Please try again.', 'error'); // SweetAlert error
        console.error(err);
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
    
    axios.post(`http://localhost:3000/rooms/${roomId}/reviews`, {
      user: user.email,
      rating,
      comment,
    })
      .then((response) => {
        if (response.data.message === 'Review added successfully') {
          Swal.fire('Success', 'Review submitted successfully', 'success'); // SweetAlert success
          setShowReviewModal(false);
        } else {
          Swal.fire('Error', response.data.message, 'error'); // SweetAlert error
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
                        <span className="ml-2 font-bold">{room.name}</span>
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
            <div className="mt-4 flex justify-between">
              <button 
                className="bg-red-500 text-white px-4 py-2 rounded-full" 
                onClick={confirmCancelBooking}>
                Confirm
              </button>
              <button 
                className="bg-gray-500 text-white px-4 py-2 rounded-full" 
                onClick={() => setShowCancelModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Date Modal */}
      {showUpdateDateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 mx-auto">
            <h2 className="text-xl font-bold mb-4">Update Booking Date</h2>
            <DatePicker
              selected={newBookingDate}
              onChange={(date) => setNewBookingDate(date)}
              minDate={new Date()}
              className="border p-2 rounded w-full"
            />
            <div className="mt-4 flex justify-between">
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded-full"
                onClick={confirmUpdateDate}>
                Confirm
              </button>
              <button 
                className="bg-gray-500 text-white px-4 py-2 rounded-full"
                onClick={() => setShowUpdateDateModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 mx-auto">
            <h2 className="text-xl font-bold mb-4">Submit Review</h2>
            <div>
              <label htmlFor="rating" className="block mb-2">Rating (1-5):</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={reviewData.rating}
                onChange={handleReviewChange}
                min="1"
                max="5"
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="comment" className="block mb-2">Comment:</label>
              <textarea
                id="comment"
                name="comment"
                value={reviewData.comment}
                onChange={handleReviewChange}
                rows="3"
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded-full"
                onClick={submitReview}>
                Submit Review
              </button>
              <button 
                className="bg-gray-500 text-white px-4 py-2 rounded-full"
                onClick={() => setShowReviewModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
