import React, { useState, useEffect } from 'react';
import ServiceList from '../components/Services/ServiceList';
import AddServiceModal from '../components/Services/AddServiceModal';

const Services = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // API call will go here
      const dummyServices = [
        {
          id: 1,
          name: "Full Grooming",
          description: "Complete grooming service including bath, haircut, and styling",
          price: 50,
          duration: 120, // in minutes
          active: true
        },
        {
          id: 2,
          name: "Nail Trimming",
          description: "Professional nail care for your pet",
          price: 20,
          duration: 30,
          active: true
        }
      ];
      setServices(dummyServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  return (
    <div className="services-page">
      <div className="page-header">
        <h1>Services Management</h1>
        <button 
          className="add-service-btn"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Service
        </button>
      </div>
      
      <ServiceList 
        services={services} 
        onUpdate={fetchServices}
      />
      
      {isModalOpen && (
        <AddServiceModal 
          onClose={() => setIsModalOpen(false)}
          onSave={fetchServices}
        />
      )}
    </div>
  );
};

export default Services; 