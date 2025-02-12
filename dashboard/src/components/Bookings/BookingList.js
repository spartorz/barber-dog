import React, { useState, useEffect } from 'react';
import BookingCard from './BookingCard';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch bookings from API
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // API call will go here
      const dummyData = [
        {
          id: 1,
          customerName: "John Doe",
          service: "Full Grooming",
          date: "2024-03-20",
          time: "10:00",
          status: "pending"
        }
      ];
      setBookings(dummyData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  return (
    <div className="booking-list">
      <h2>Upcoming Appointments</h2>
      {bookings.map(booking => (
        <BookingCard 
          key={booking.id} 
          booking={booking}
          onStatusUpdate={fetchBookings}
        />
      ))}
    </div>
  );
};

export default BookingList; 