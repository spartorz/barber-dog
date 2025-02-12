const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiService {
    // Generic request handler with error management
    async fetchWithAuth(endpoint, options = {}) {
        try {
            const token = localStorage.getItem('authToken');
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers
            };

            const response = await fetch(`${BASE_URL}${endpoint}`, {
                ...options,
                headers
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'API request failed');
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error: ${error.message}`);
            throw error;
        }
    }

    // Services
    async getServices() {
        return this.fetchWithAuth('/services');
    }

    async createService(serviceData) {
        return this.fetchWithAuth('/services', {
            method: 'POST',
            body: JSON.stringify(serviceData)
        });
    }

    // Products
    async getProducts() {
        return this.fetchWithAuth('/products');
    }

    async updateProduct(productId, productData) {
        return this.fetchWithAuth(`/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    }

    // Bookings with real-time updates
    async getBookings() {
        return this.fetchWithAuth('/bookings');
    }

    async createBooking(bookingData) {
        return this.fetchWithAuth('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    }

    async updateBookingStatus(bookingId, status) {
        return this.fetchWithAuth(`/bookings/${bookingId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
    }
}

export const apiService = new ApiService(); 