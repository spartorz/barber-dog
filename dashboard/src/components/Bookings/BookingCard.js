import React, { useState } from 'react';

const BookingCard = ({ booking, onStatusUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = async (newStatus) => {
    try {
      // API call to update booking status
      await fetch(`/api/bookings/${booking.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      onStatusUpdate();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  return (
    <div className={`booking-card ${booking.status}`}>
      <div className="booking-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="booking-basic-info">
          <h3>{booking.customerName}</h3>
          <p>{booking.service}</p>
          <p>{new Date(booking.date).toLocaleDateString()} - {booking.time}</p>
        </div>
        <div className="booking-status">
          <span className={`status-badge ${booking.status}`}>
            {booking.status}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="booking-details">
          <div className="contact-info">
            <p>📱 {booking.phoneNumber}</p>
            <p>🐕 {booking.petType}</p>
            {booking.notes && <p>📝 {booking.notes}</p>}
          </div>
          
          <div className="booking-actions">
            {booking.status === 'pending' && (
              <>
                <button 
                  className="accept-btn"
                  onClick={() => handleStatusChange('confirmed')}
                >
                  Accept
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => handleStatusChange('rejected')}
                >
                  Reject
                </button>
              </>
            )}
            <button 
              className="edit-btn"
              onClick={() => {/* Add edit functionality */}}
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard; 