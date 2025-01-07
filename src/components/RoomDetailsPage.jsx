import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AuthContext } from './AuthProvider';
import { FaStar, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const RoomDetailsPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);
  const [room, setRoom] = useState(null);
  const [bookingDate, setBookingDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [errorFetchingReviews, setErrorFetchingReviews] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [roomBookingDetails, setRoomBookingDetails] = useState(null);

  useEffect(() => {
    if (roomId) {
      fetch(`https://hotel-server-flax.vercel.app/rooms/${roomId}`)
        .then((response) => response.json())
        .then((data) => setRoom(data))
        .catch((err) => console.error('Error fetching room details:', err));

      fetch(`https://hotel-server-flax.vercel.app/rooms/${roomId}/reviews`)
        .then((response) => response.json())
        .then((data) => {
          setReviews(Array.isArray(data) ? data : []);
          setLoadingReviews(false);
        })
        .catch((err) => {
          console.error('Error fetching reviews:', err);
          setErrorFetchingReviews(true);
          setLoadingReviews(false);
        });
    }
  }, [roomId]);

  const handleBooking = () => {
    if (!user) {
      Swal.fire({
        title: 'Please log in to book this room',
        icon: 'warning',
        confirmButtonText: 'Go to Login',
      }).then(() => navigate('/login'));
      return;
    }
  
    if (!bookingDate || !checkOutDate) {
      Swal.fire('Please select both check-in and check-out dates', '', 'error');
      return;
    }
  
    if (checkOutDate <= bookingDate) {
      Swal.fire('Check-out date must be after the check-in date', '', 'error');
      return;
    }
  
    // Check if room is available, if not show a SweetAlert
    if (!room.isAvailable) {
      Swal.fire('Sorry, this room is not available.', '', 'error');
      return;
    }
  
    // Set room booking details for the modal
    setRoomBookingDetails({
      roomName: room.name,
      roomPrice: room.price,
      bookingDate,
      checkOutDate,
      description: room.description,
    });
  
    // Show the modal
    setShowModal(true);
  };
  

  const handleConfirmBooking = () => {
    fetch(`https://hotel-server-flax.vercel.app/rooms/${roomId}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingDate,
        checkOutDate,
        user: { email: user.email },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Swal.fire('Booking successful!', '', 'success');
          setRoom({ ...room, isAvailable: false });
        } else {
          Swal.fire('Booking Successfully Done', data.message, 'success');
        }
      })
      .catch((err) => Swal.fire('Error', err.message, 'error'));

    // Close the modal after booking
    setShowModal(false);
  };

  const handlePostReview = () => {
    if (!user) {
      Swal.fire({
        title: 'Please log in to post a review',
        icon: 'warning',
        confirmButtonText: 'Go to Login',
      }).then(() => navigate('/login'));
      return;
    }

    if (!reviewRating || !reviewText.trim()) {
      Swal.fire('Please provide a rating and comment', '', 'error');
      return;
    }

    fetch(`https://hotel-server-flax.vercel.app/rooms/${roomId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: user.email,
        rating: reviewRating,
        comment: reviewText,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Review added successfully') {
          Swal.fire('Review posted!', '', 'success');
          setReviews([...reviews, { user: user.email, rating: reviewRating, comment: reviewText }]);
          setReviewText('');
          setReviewRating(0);
        } else {
          Swal.fire('Error posting review', data.message, 'error');
        }
      })
      .catch((err) => Swal.fire('Error', err.message, 'error'));
  };

  if (loading) return <div>Loading...</div>;
  if (!room) return <div>Room not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="room-details"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={room.images}
          alt={room.name}
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
        <h1 className="text-4xl text-gray-300 font-bold my-4">{room.name}</h1>
        <p className="text-gray-100">{room.description}</p>
        <p className="text-2xl  font-semibold text-green-600 my-2">
          Price: {room.price} USD/night
        </p>

        <div className="booking-section mt-6">
          <h2 className="text-2xl text-gray-100 font-semibold mb-2 flex items-center gap-2">
            <FaCalendarAlt /> Select Booking Dates
          </h2>
          <div className="flex gap-4 flex-wrap">
            <DatePicker
              selected={bookingDate}
              onChange={setBookingDate}
              className="input w-full sm:w-1/2 border rounded-md p-2"
              placeholderText="Check-in Date"
            />
            <DatePicker
              selected={checkOutDate}
              onChange={setCheckOutDate}
              className="input w-full sm:w-1/2 border rounded-md p-2"
              placeholderText="Check-out Date"
            />
          </div>
          <button
            onClick={handleBooking}
            className="bg-blue-600 text-white px-6 py-2 mt-4 rounded-lg hover:bg-blue-700 transition-all"
            // disabled={!room.isAvailable}
          >
            Book Now
          </button>
        </div>
      </motion.div>

      {/* Modal for booking confirmation */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
            <h2 className="text-2xl font-semibold mb-4">Confirm Your Booking</h2>
            <p><strong>Room:</strong> {roomBookingDetails.roomName}</p>
            <p><strong>Price:</strong> {roomBookingDetails.roomPrice} USD/night</p>
            <p><strong>Description:</strong> {roomBookingDetails.description}</p>
            <p><strong>Booking Date:</strong> {bookingDate ? bookingDate.toLocaleDateString() : ''}</p>
            <p><strong>Check-out Date:</strong> {checkOutDate ? checkOutDate.toLocaleDateString() : ''}</p>

            <h3 className="text-xl font-semibold mt-4">Select Booking Date</h3>
            <DatePicker
              selected={bookingDate}
              onChange={setBookingDate}
              className="input w-full border rounded-md p-2"
              placeholderText="Booking Date"
              dateFormat="MMMM d, yyyy"
              isClearable
              inline
            />

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      <motion.div
        className="reviews-section mt-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl text-cyan-200 font-semibold">Reviews</h2>
        {loadingReviews ? (
          <p>Loading reviews...</p>
        ) : errorFetchingReviews ? (
          <p>Error fetching reviews. Please try again later.</p>
        ) : reviews.length === 0 ? (
          <p className='text-gray-100'>No reviews yet.</p>
        ) : (
          reviews.map((review, index) => (
            <div
              key={index}
              className="review-item bg-gray-100 p-4 rounded-lg shadow-md my-2"
            >
              <p className="text-xl font-medium">
                <FaStar className="text-yellow-500 inline" /> {review.rating}/5
              </p>
              <p>{review.comment}</p>
              <small className="text-gray-600">- {review.user}</small>
            </div>
          ))
        )}
        <div className="review-form mt-4">
          <h3 className="text-xl text-gray-100 font-semibold">Post a Review</h3>
          <input
            type="number"
            max="5"
            min="1"
            placeholder="Rating (1-5)"
            value={reviewRating}
            onChange={(e) => setReviewRating(parseInt(e.target.value))}
            className="input w-full border rounded-md p-2 my-2"
          />
          <textarea
            placeholder="Write your review here..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="textarea w-full border rounded-md p-2 my-2"
          ></textarea>
          <button
            onClick={handlePostReview}
            className="bg-green-600 font-bold text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all"
          >
            Submit Review
          </button>
        </div>
      </motion.div>
      <div className="flex justify-center mt-6">
  <Link to="/rooms">
    <button
      className="px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-300"
    >
      Back To Rooms
    </button>
  </Link>
</div>

    </div>
  );
};

export default RoomDetailsPage;
