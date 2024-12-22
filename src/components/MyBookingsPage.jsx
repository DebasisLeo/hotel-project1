import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AuthContext } from './AuthProvider';

const MyBookingsPage = () => {
  const { user } = useContext(AuthContext); // Get the user from AuthContext
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]); // New state to store room data
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdateDateModal, setShowUpdateDateModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newBookingDate, setNewBookingDate] = useState(null);
  const [error, setError] = useState(null);

  // Fetch bookings of the logged-in user
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
              })
              .catch((err) => setError(err.message));
          });
        })
        .catch((err) => setError(err.message));
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
      .then((data) => {
        alert('Booking canceled successfully');
        setBookings(bookings.filter((booking) => booking._id !== selectedBooking));
        setShowCancelModal(false);
      })
      .catch((err) => alert('Booking cancellation failed: ' + err.message));
  };

  const handleUpdateDate = (bookingId) => {
    setSelectedBooking(bookingId);
    setShowUpdateDateModal(true);
  };

  const confirmUpdateDate = () => {
    if (!newBookingDate) {
      alert("Please select a new date.");
      return;
    }
  
    if (newBookingDate < new Date()) {
      alert("The selected date cannot be in the past.");
      return;
    }
  
    const updatedBooking = {
      ...bookings.find((booking) => booking._id === selectedBooking),
      bookingDate: newBookingDate.toISOString(), // Ensure it's in ISO format
    };
  
    fetch(`http://localhost:3000/bookings/${selectedBooking}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBooking),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Booking date updated successfully');
        setBookings(
          bookings.map((booking) =>
            booking._id === selectedBooking ? updatedBooking : booking
          )
        );
        setShowUpdateDateModal(false);
      })
      .catch((err) => alert('Booking date update failed: ' + err.message));
  };
  

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Please log in to view your bookings.</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">My Bookings</h1>

      {bookings.length === 0 ? (
        <p>You have no bookings.</p>
      ) : (
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
                          src={room.images} // Room image fetched by roomId
                          alt={room.name}
                          className="w-16 h-16 object-cover"
                        />
                        <span>{room.name}</span>
                      </>
                    ) : (
                      <p>Loading...</p>
                    )}
                  </td>
                  <td className="border-b px-4 py-2">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td className="border-b px-4 py-2">{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                  <td className="border-b px-4 py-2">
                    {room ? `$${room.price}` : 'Loading...'}
                  </td>
                  <td className="border-b px-4 py-2">
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                    >
                      Cancel Booking
                    </button>
                    <button
                      onClick={() => handleUpdateDate(booking._id)}
                      className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700 ml-2"
                    >
                      Update Date
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
            <button
              onClick={confirmCancelBooking}
              className="bg-green-500 text-white py-2 px-4 rounded mt-4 w-full hover:bg-green-700"
            >
              Yes, Cancel Booking
            </button>
            <button
              onClick={() => setShowCancelModal(false)}
              className="bg-red-500 text-white py-2 px-4 rounded mt-4 w-full hover:bg-red-700"
            >
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
            <DatePicker
              selected={newBookingDate}
              onChange={setNewBookingDate}
              minDate={new Date()}
              className="border p-2 rounded"
              placeholderText="Select New Date"
            />
            <button
              onClick={confirmUpdateDate}
              className="bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full hover:bg-blue-700"
            >
              Confirm Update
            </button>
            <button
              onClick={() => setShowUpdateDateModal(false)}
              className="bg-red-500 text-white py-2 px-4 rounded mt-4 w-full hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
