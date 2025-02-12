import React, { useState, useEffect } from 'react';
import { wsService } from '../../../shared/services/websocketService';
import './BookingManagement.css';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch existing bookings
        fetchBookings();

        // Subscribe to new bookings
        wsService.subscribe('new_booking', handleNewBooking);

        return () => {
            // Cleanup WebSocket subscription
            wsService.unsubscribe('new_booking', handleNewBooking);
        };
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/bookings');
            const data = await response.json();
            setBookings(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setLoading(false);
        }
    };

    const handleNewBooking = (booking) => {
        // Add new booking to the list and show notification
        setBookings(prev => [booking, ...prev]);
        showNotification('New Booking Received');
    };

    const updateBookingStatus = async (bookingId, status) => {
        try {
            const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                // Update local state
                setBookings(prev => 
                    prev.map(booking => 
                        booking._id === bookingId 
                            ? { ...booking, status } 
                            : booking
                    )
                );

                // Notify customer about status change (you can implement this)
                wsService.send('booking_status_update', { bookingId, status });
            }
        } catch (error) {
            console.error('Error updating booking:', error);
        }
    };

    return (
        <div className="booking-management">
            <h2>Booking Management</h2>
            
            {loading ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
                <div className="bookings-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Pet Name</th>
                                <th>Service</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking._id}>
                                    <td>{booking.petName}</td>
                                    <td>{booking.service}</td>
                                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                                    <td>{booking.time}</td>
                                    <td>
                                        <span className={`status ${booking.status}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                                                className="confirm-btn"
                                            >
                                                Confirm
                                            </button>
                                            <button 
                                                onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                                                className="cancel-btn"
                                            >
                                                Cancel
                                            </button>
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