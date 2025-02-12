document.addEventListener('DOMContentLoaded', () => {
    const bookButtons = document.querySelectorAll('.book-btn');
    
    bookButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.service-card');
            const serviceName = card.querySelector('h2').textContent;
            
            // Show booking modal
            showBookingModal(serviceName);
        });
    });

    // Initialize Flatpickr calendar
    flatpickr("#inline-calendar", {
        inline: true,
        minDate: "today",
        dateFormat: "Y-m-d",
        disable: [
            function(date) {
                // Disable Sundays
                return date.getDay() === 0;
            }
        ],
        onChange: function(selectedDates, dateStr) {
            document.getElementById('bookingDate').value = dateStr;
            // You could fetch available time slots here based on the selected date
            updateTimeSlots(dateStr);
        }
    });

    // Handle time slot selection
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            // Remove selected class from all slots
            timeSlots.forEach(s => s.classList.remove('selected'));
            // Add selected class to clicked slot
            this.classList.add('selected');
            // Update hidden input
            document.getElementById('selectedTime').value = this.dataset.time;
        });
    });

    const bookingForm = document.getElementById('bookingForm');
    
    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            petName: document.getElementById('petName').value,
            petType: document.getElementById('petType').value,
            date: document.getElementById('bookingDate').value,
            time: document.getElementById('selectedTime').value,
            service: document.querySelector('.service-card.selected').dataset.serviceName,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        try {
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Send WebSocket message for real-time dashboard update
                wsService.send('new_booking', formData);
                
                showSuccessMessage('Booking successful! We will confirm shortly.');
                bookingForm.reset();
            } else {
                throw new Error('Booking failed');
            }
        } catch (error) {
            showErrorMessage('Failed to book appointment. Please try again.');
            console.error('Booking error:', error);
        }
    });
});

function showBookingModal(serviceName) {
    // Create and show booking form modal
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Book ${serviceName}</h2>
            <form id="bookingForm">
                <input type="text" placeholder="Your Name" required>
                <input type="email" placeholder="Your Email" required>
                <input type="date" required>
                <input type="time" required>
                <button type="submit">Confirm Booking</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function updateTimeSlots(date) {
    // Here you would typically fetch available time slots from your backend
    // For now, we'll just simulate it
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        // Randomly disable some time slots
        slot.disabled = Math.random() > 0.7;
        if (slot.disabled) {
            slot.classList.add('disabled');
        } else {
            slot.classList.remove('disabled');
        }
    });
} 