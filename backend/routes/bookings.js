const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Get all bookings (protected route)
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new booking (public route)
router.post('/', async (req, res) => {
  const booking = new Booking(req.body);
  try {
    const newBooking = await booking.save();
    // Broadcast to all connected WebSocket clients
    req.app.get('wss').clients.forEach(client => {
      client.send(JSON.stringify({
        type: 'new_booking',
        data: newBooking
      }));
    });
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update booking status (protected route)
router.patch('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (booking) {
      // Broadcast status update
      req.app.get('wss').clients.forEach(client => {
        client.send(JSON.stringify({
          type: 'booking_status_update',
          data: booking
        }));
      });
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 