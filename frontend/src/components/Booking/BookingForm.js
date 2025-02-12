import React, { useState } from 'react';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    petType: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to backend will go here
      console.log('Booking submitted:', formData);
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h2>Book an Appointment</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          required
        />
      </div>
      <div className="form-group">
        <select
          value={formData.service}
          onChange={(e) => setFormData({...formData, service: e.target.value})}
          required
        >
          <option value="">Select Service</option>
          <option value="grooming">Full Grooming</option>
          <option value="nails">Nail Trimming</option>
          <option value="bath">Bath & Brush</option>
        </select>
      </div>
      <button type="submit">Book Now</button>
    </form>
  );
};

export default BookingForm; 