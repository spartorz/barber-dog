document.addEventListener('DOMContentLoaded', () => {
    // Handle sidebar navigation
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const contentSections = document.querySelectorAll('section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target.getAttribute('href').substring(1);
            
            // Show relevant section
            contentSections.forEach(section => {
                section.style.display = 
                    section.id === target ? 'block' : 'none';
            });
            
            // Update active state
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            link.parentElement.classList.add('active');
        });
    });
    
    // Handle booking actions
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', handleBookingAction);
    });
});

function handleBookingAction(e) {
    const action = e.target.textContent.toLowerCase();
    const bookingRow = e.target.closest('tr');
    
    switch(action) {
        case 'view':
            // Show booking details
            showBookingDetails(bookingRow);
            break;
        case 'edit':
            // Show edit form
            showEditForm(bookingRow);
            break;
    }
} 