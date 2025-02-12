import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { wsService } from '../services/websocketService';
import './BookingManagement.css';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initial fetch
    fetchBookings();

    // Set up WebSocket
    wsService.connect();
    wsService.subscribe('booking_update', handleBookingUpdate);
    wsService.subscribe('new_booking', handleNewBooking);

    return () => {
      wsService.unsubscribe('booking_update', handleBookingUpdate);
      wsService.unsubscribe('new_booking', handleNewBooking);
    };
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await apiService.getBookings();
      setBookings(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingUpdate = (updatedBooking) => {
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    );
  };

  const handleNewBooking = (newBooking) => {
    setBookings(prevBookings => [...prevBookings, newBooking]);
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await apiService.updateBookingStatus(bookingId, newStatus);
      // WebSocket will handle the update
    } catch (err) {
      setError('Failed to update booking status');
      console.error(err);
    }
  };

  return (
    <div className="booking-management">
      <div className="booking-header">
        <h2>Booking Management</h2>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''} 
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={filter === 'confirmed' ? 'active' : ''} 
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''} 
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading bookings...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="bookings-table">
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Pet Details</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id} className={`status-${booking.status}`}>
                  <td>
                    <div className="booking-time">
                      <div>{new Date(booking.date).toLocaleDateString()}</div>
                      <div>{booking.time}</div>
                    </div>
                  </td>
                  <td>
                    <div className="customer-info">
                      <div>{booking.customerName}</div>
                      <div className="customer-contact">{booking.customerPhone}</div>
                    </div>
                  </td>
                  <td>{booking.serviceName}</td>
                  <td>
                    <div className="pet-info">
                      <div>{booking.petName}</div>
                      <div className="pet-breed">{booking.petBreed}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {booking.status === 'pending' && (
                        <>
                          <button 
                            className="confirm-btn"
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          >
                            Confirm
                          </button>
                          <button 
                            className="cancel-btn"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <button 
                          className="complete-btn"
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingManagement; 