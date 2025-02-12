import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

const ServiceCard = ({ service, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedService, setEditedService] = useState(service);

  const handleSave = async () => {
    try {
      // API call to update service
      await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedService)
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleImageUpload = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('serviceId', service.id);

      const response = await fetch('/api/services/upload-image', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const { imageUrl } = await response.json();
        setEditedService({
          ...editedService,
          imageUrl
        });
        onUpdate();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="service-card">
      {isEditing ? (
        <div className="service-edit-form">
          <ImageUpload
            currentImage={editedService.imageUrl}
            onImageUpload={handleImageUpload}
          />
          <input
            type="text"
            value={editedService.name}
            onChange={(e) => setEditedService({
              ...editedService,
              name: e.target.value
            })}
          />
          <textarea
            value={editedService.description}
            onChange={(e) => setEditedService({
              ...editedService,
              description: e.target.value
            })}
          />
          <input
            type="number"
            value={editedService.price}
            onChange={(e) => setEditedService({
              ...editedService,
              price: parseFloat(e.target.value)
            })}
          />
          <input
            type="number"
            value={editedService.duration}
            onChange={(e) => setEditedService({
              ...editedService,
              duration: parseInt(e.target.value)
            })}
          />
          <div className="edit-actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="service-image">
            {service.imageUrl ? (
              <img src={service.imageUrl} alt={service.name} />
            ) : (
              <div className="no-image">No Image</div>
            )}
          </div>
          <div className="service-info">
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <div className="service-details">
              <span className="price">${service.price}</span>
              <span className="duration">{service.duration} mins</span>
            </div>
          </div>
          <div className="service-actions">
            <button 
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button 
              className={`toggle-btn ${service.active ? 'active' : 'inactive'}`}
              onClick={() => {
                // Toggle service active status
              }}
            >
              {service.active ? 'Active' : 'Inactive'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ServiceCard; 