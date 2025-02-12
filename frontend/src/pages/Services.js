import React, { useState, useEffect } from 'react';
import { apiService } from '../../shared/services/apiService.js';
import BookingForm from '../components/Booking/BookingForm';
import '../styles/Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await apiService.getServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'grooming', name: 'Grooming' },
    { id: 'spa', name: 'Spa & Treatment' },
    { id: 'basic', name: 'Basic Care' }
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  return (
    <div className="services-container">
      {/* Hero Section */}
      <div className="services-hero">
        <h1>Our Services</h1>
        <p>Professional pet grooming services for your furry friends</p>
      </div>

      {/* Categories */}
      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="services-grid">
        {filteredServices.map(service => (
          <div key={service.id} className="service-card">
            <div className="service-image">
              <img 
                src={service.imageUrl} 
                alt={service.name}
                loading="lazy"
              />
            </div>
            <div className="service-content">
              <h2>{service.name}</h2>
              <p className="description">{service.description}</p>
              <div className="service-details">
                <div className="detail">
                  <span className="icon">⏱️</span>
                  <span>{service.duration} mins</span>
                </div>
                <div className="detail">
                  <span className="icon">💰</span>
                  <span>${service.price}</span>
                </div>
              </div>
              <button 
                className="book-btn"
                onClick={() => {
                  setSelectedService(service);
                  setShowBookingForm(true);
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Why Choose Us Section */}
      <div className="why-choose-us">
        <h2>Why Choose Our Services?</h2>
        <div className="features">
          <div className="feature">
            <span className="feature-icon">🏆</span>
            <h3>Professional Care</h3>
            <p>Experienced groomers dedicated to your pet's well-being</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💝</span>
            <h3>Gentle Approach</h3>
            <p>Stress-free environment for your pets</p>
          </div>
          <div className="feature">
            <span className="feature-icon">✨</span>
            <h3>Premium Products</h3>
            <p>High-quality products for the best results</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <div className="contact-content">
          <h2>Questions?</h2>
          <p>Contact us for more information about our services</p>
          <button 
            className="contact-btn"
            onClick={() => window.location.href = '/contact'}
          >
            Contact Us
          </button>
        </div>
      </div>

      {showBookingForm && selectedService && (
        <BookingForm
          service={selectedService}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
};

export default Services; 