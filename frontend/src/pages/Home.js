import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Barber Dog</h1>
          <p>Professional Pet Grooming Services</p>
          <Link to="/booking" className="cta-button">Book Now</Link>
        </div>
      </section>

      {/* Services Preview */}
      <section className="services-preview">
        <h2>Our Services</h2>
        <div className="services-grid">
          <div className="service-preview-card">
            <img src="/images/grooming.webp" alt="Full Grooming" />
            <h3>Full Grooming</h3>
            <p>Complete grooming service for your pet</p>
            <span className="price">From $50</span>
          </div>
          <div className="service-preview-card">
            <img src="/images/bath.webp" alt="Bath & Brush" />
            <h3>Bath & Brush</h3>
            <p>Refreshing bath and brushing service</p>
            <span className="price">From $30</span>
          </div>
          <div className="service-preview-card">
            <img src="/images/nails.webp" alt="Nail Trimming" />
            <h3>Nail Trimming</h3>
            <p>Professional nail care service</p>
            <span className="price">From $15</span>
          </div>
        </div>
        <Link to="/services" className="view-all-button">View All Services</Link>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <h2>Why Choose Us?</h2>
          <div className="features">
            <div className="feature">
              <span className="icon">🏆</span>
              <h3>Expert Groomers</h3>
              <p>Professional and experienced pet stylists</p>
            </div>
            <div className="feature">
              <span className="icon">💝</span>
              <h3>Pet Friendly</h3>
              <p>Caring and gentle approach</p>
            </div>
            <div className="feature">
              <span className="icon">✨</span>
              <h3>Quality Service</h3>
              <p>Premium products and equipment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="gallery-preview">
        <h2>Our Work</h2>
        <div className="gallery-grid">
          {/* Add 6-8 images here */}
        </div>
        <Link to="/gallery" className="view-all-button">View Gallery</Link>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <h2>Visit Us</h2>
        <div className="contact-grid">
          <div className="contact-info">
            <h3>Contact Information</h3>
            <p>📍 123 Pet Street, City</p>
            <p>📞 (123) 456-7890</p>
            <p>✉️ info@barberdog.com</p>
          </div>
          <div className="business-hours">
            <h3>Business Hours</h3>
            <p>Monday - Friday: 9am - 6pm</p>
            <p>Saturday: 10am - 4pm</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 