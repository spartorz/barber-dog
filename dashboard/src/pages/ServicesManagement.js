import React, { useState, useEffect } from 'react';
import ServiceList from '../components/Services/ServiceList';
import AddServiceModal from '../components/Services/AddServiceModal';
import './ServicesManagement.css';

const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    popular: null
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);
      
      // Calculate stats
      setStats({
        total: data.length,
        active: data.filter(s => s.active).length,
        popular: data.reduce((prev, current) => 
          (prev.bookings > current.bookings) ? prev : current, data[0])
      });
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="services-management">
      <div className="page-header">
        <div className="header-content">
          <h1>Services Management</h1>
          <button 
            className="add-service-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Add New Service
          </button>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <h3>Total Services</h3>
            <span className="stat-number">{stats.total}</span>
          </div>
          <div className="stat-card">
            <h3>Active Services</h3>
            <span className="stat-number">{stats.active}</span>
          </div>
          {stats.popular && (
            <div className="stat-card">
              <h3>Most Popular</h3>
              <span className="stat-text">{stats.popular.name}</span>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <ServiceList 
          services={services} 
          onUpdate={fetchServices}
        />
      )}

      {isModalOpen && (
        <AddServiceModal 
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            fetchServices();
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ServicesManagement; 