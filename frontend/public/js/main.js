// Shared functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navigation toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if(navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Services page functionality
if(document.querySelector('.time-slots')) {
    const timeSlots = document.querySelectorAll('.time-slot');
    const bookingForm = document.getElementById('bookingForm');

    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            timeSlots.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
        });
    });

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            petName: document.getElementById('petName').value,
            petType: document.getElementById('petType').value,
            date: document.getElementById('bookingDate').value,
            time: document.querySelector('.time-slot.selected')?.dataset.time
        };

        try {
            // Send booking request
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if(response.ok) {
                showNotification('Booking successful!', 'success');
                bookingForm.reset();
            } else {
                throw new Error('Booking failed');
            }
        } catch(error) {
            showNotification('Booking failed. Please try again.', 'error');
        }
    });
}

// Products page functionality
if(document.querySelector('.products-grid')) {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('searchInput');
    const productsGrid = document.querySelector('.products-grid');

    // Category filtering
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts(btn.dataset.category);
        });
    });

    // Search functionality
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            filterProducts(document.querySelector('.category-btn.active').dataset.category);
        }, 300);
    });

    // Quick view functionality
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            showQuickView(card.dataset);
        });
    });

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            addToCart(card.dataset);
        });
    });
}

// Utility functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function filterProducts(category) {
    const searchTerm = searchInput.value.toLowerCase();
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const shouldShow = 
            (category === 'all' || product.dataset.category === category) &&
            product.textContent.toLowerCase().includes(searchTerm);
        
        product.style.display = shouldShow ? 'block' : 'none';
    });
} 