import React from 'react';
import { apiService } from '../../../shared/services/apiService';
import ServiceCard from './ServiceCard';
import './ServiceList.css';

const ServiceList = ({ services, onEdit, onDelete }) => {
  const handleDelete = async (serviceId) => {
    try {
      await apiService.deleteService(serviceId);
      onDelete(serviceId);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  return (
    <div className="service-list">
      {services.map(service => (
        <ServiceCard
          key={service._id}
          service={service}
          onEdit={() => onEdit(service)}
          onDelete={() => handleDelete(service._id)}
        />
      ))}
    </div>
  );
};

export default ServiceList; 