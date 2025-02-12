// Handle cart functionality
document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Cart toggle
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('open');
    });
    
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const productName = card.querySelector('h2').textContent;
            const price = card.querySelector('.price').textContent;
            
            // Add to cart logic here
            updateCart(productName, price);
        });
    });
}); 