import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AuthContext } from './AuthProvider';
import { FaStar, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

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

  useEffect(() => {
    if (roomId) {
      fetch(`http://localhost:3000/rooms/${roomId}`)
        .then((response) => response.json())
        .then((data) => setRoom(data))
        .catch((err) => console.error('Error fetching room details:', err));

      fetch(`http://localhost:3000/rooms/${roomId}/reviews`)
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
      alert('Please log in to book this room');
      navigate('/login');
      return;
    }

    if (!bookingDate || !checkOutDate) {
      alert('Please select both check-in and check-out dates');
      return;
    }

    if (checkOutDate <= bookingDate) {
      alert('Check-out date must be after the check-in date');
      return;
    }

    fetch(`http://localhost:3000/rooms/${roomId}/book`, {
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
          alert('Booking successful!');
          setRoom({ ...room, isAvailable: false });
        } else {
          alert('Booking failed: ' + data.message);
        }
      })
      .catch((err) => console.error(err));
  };

  const handlePostReview = () => {
    if (!user) {
      alert('Please log in to post a review');
      navigate('/login');
      return;
    }

    if (!reviewRating || !reviewText.trim()) {
      alert('Please provide a rating and comment');
      return;
    }

    fetch(`http://localhost:3000/rooms/${roomId}/reviews`, {
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
          alert('Review posted!');
          setReviews([...reviews, { user: user.email, rating: reviewRating, comment: reviewText }]);
          setReviewText('');
          setReviewRating(0);
        } else {
          alert('Error posting review: ' + data.message);
        }
      })
      .catch((err) => console.error(err));
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
        <h1 className="text-4xl font-bold my-4">{room.name}</h1>
        <p className="text-gray-700">{room.description}</p>
        <p className="text-2xl font-semibold text-green-600 my-2">
          Price: {room.price} USD/night
        </p>

        <div className="booking-section mt-6">
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <FaCalendarAlt /> Select Booking Dates
          </h2>
          <div className="flex gap-4">
            <DatePicker
              selected={bookingDate}
              onChange={setBookingDate}
              className="input w-full border rounded-md p-2"
              placeholderText="Check-in Date"
            />
            <DatePicker
              selected={checkOutDate}
              onChange={setCheckOutDate}
              className="input w-full border rounded-md p-2"
              placeholderText="Check-out Date"
            />
          </div>
          <button
            onClick={handleBooking}
            className="bg-blue-600 text-white px-6 py-2 mt-4 rounded-lg hover:bg-blue-700 transition-all"
            disabled={!room.isAvailable}
          >
            Book Now
          </button>
        </div>
      </motion.div>

      <motion.div
        className="reviews-section mt-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-semibold">Reviews</h2>
        {loadingReviews ? (
          <p>Loading reviews...</p>
        ) : errorFetchingReviews ? (
          <p>Error fetching reviews. Please try again later.</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet.</p>
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
          <h3 className="text-xl font-semibold">Post a Review</h3>
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
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all"
          >
            Submit Review
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoomDetailsPage;
