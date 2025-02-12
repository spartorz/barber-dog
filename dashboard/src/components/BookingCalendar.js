import React, { useState, useEffect } from 'react';
import Calendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { startOfWeek, format } from 'date-fns';
import './BookingCalendar.css';

const localizer = Calendar.momentLocalizer(moment);

const BookingCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [view, setView] = useState('week');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      
      // Format bookings for calendar
      const formattedBookings = data.map(booking => ({
        id: booking.id,
        title: `${booking.serviceName} - ${booking.customerName}`,
        start: new Date(booking.date + 'T' + booking.startTime),
        end: new Date(booking.date + 'T' + booking.endTime),
        resource: booking
      }));
      
      setBookings(formattedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const checkConflicts = (startTime, endTime, serviceId) => {
    const conflicts = bookings.filter(booking => {
      // Skip comparing with itself
      if (booking.id === selectedSlot?.id) return false;

      // Check time overlap
      const bookingStart = new Date(booking.start);
      const bookingEnd = new Date(booking.end);
      const newStart = new Date(startTime);
      const newEnd = new Date(endTime);

      return (
        (newStart >= bookingStart && newStart < bookingEnd) ||
        (newEnd > bookingStart && newEnd <= bookingEnd) ||
        (newStart <= bookingStart && newEnd >= bookingEnd)
      );
    });

    return conflicts;
  };

  const handleSlotSelect = ({ start, end }) => {
    // Check if selected time is in the past
    if (start < new Date()) {
      alert("Cannot book appointments in the past");
      return;
    }

    // Check business hours (9 AM to 6 PM)
    const hour = start.getHours();
    if (hour < 9 || hour >= 18) {
      alert("Bookings are only available between 9 AM and 6 PM");
      return;
    }

    // Check for conflicts
    const conflicts = checkConflicts(start, end);
    setConflicts(conflicts);

    setSelectedSlot({
      start,
      end,
      conflicts: conflicts.length > 0
    });
  };

  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: '#3174ad'
    };

    // Style for different booking statuses
    switch (event.resource.status) {
      case 'confirmed':
        style.backgroundColor = '#28a745';
        break;
      case 'pending':
        style.backgroundColor = '#ffc107';
        break;
      case 'completed':
        style.backgroundColor = '#6c757d';
        break;
      default:
        break;
    }

    return { style };
  };

  return (
    <div className="booking-calendar">
      <div className="calendar-header">
        <h2>Booking Calendar</h2>
        <div className="view-controls">
          <button 
            className={view === 'month' ? 'active' : ''} 
            onClick={() => setView('month')}
          >
            Month
          </button>
          <button 
            className={view === 'week' ? 'active' : ''} 
            onClick={() => setView('week')}
          >
            Week
          </button>
          <button 
            className={view === 'day' ? 'active' : ''} 
            onClick={() => setView('day')}
          >
            Day
          </button>
        </div>
      </div>

      <Calendar
        localizer={localizer}
        events={bookings}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        view={view}
        onView={setView}
        selectable
        onSelectSlot={handleSlotSelect}
        eventPropGetter={eventStyleGetter}
        min={new Date(0, 0, 0, 9, 0, 0)} // 9 AM
        max={new Date(0, 0, 0, 18, 0, 0)} // 6 PM
        formats={{
          timeGutterFormat: (date) => format(date, 'HH:mm'),
          dayHeaderFormat: (date) => format(date, 'EEE MM/dd')
        }}
      />

      {/* Conflict Warning Modal */}
      {selectedSlot && conflicts.length > 0 && (
        <div className="conflict-modal">
          <div className="conflict-content">
            <h3>Booking Conflicts Detected!</h3>
            <div className="conflict-list">
              {conflicts.map(conflict => (
                <div key={conflict.id} className="conflict-item">
                  <p>
                    {conflict.title}<br />
                    <small>
                      {format(conflict.start, 'HH:mm')} - 
                      {format(conflict.end, 'HH:mm')}
                    </small>
                  </p>
                </div>
              ))}
            </div>
            <div className="conflict-actions">
              <button onClick={() => setSelectedSlot(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar; 