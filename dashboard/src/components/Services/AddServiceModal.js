import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

const AddServiceModal = ({ onClose, onSave }) => {
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 30,
    active: true,
    imageUrl: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to create new service
      await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newService)
      });
      onSave();
      onClose();
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  const handleImageUpload = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch('/api/services/upload-image', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const { imageUrl } = await response.json();
        setNewService({
          ...newService,
          imageUrl
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Service</h2>
        <form onSubmit={handleSubmit}>
          <ImageUpload
            currentImage={newService.imageUrl}
            onImageUpload={handleImageUpload}
          />
          <div className="form-group">
            <label>Service Name</label>
            <input
              type="text"
              value={newService.name}
              onChange={(e) => setNewService({
                ...newService,
                name: e.target.value
              })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={newService.description}
              onChange={(e) => setNewService({
                ...newService,
                description: e.target.value
              })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Price ($)</label>
            <input
              type="number"
              value={newService.price}
              onChange={(e) => setNewService({
                ...newService,
                price: parseFloat(e.target.value)
              })}
              required
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              value={newService.duration}
              onChange={(e) => setNewService({
                ...newService,
                duration: parseInt(e.target.value)
              })}
              required
              min="15"
              step="15"
            />
          </div>
          
          <div className="modal-actions">
            <button type="submit" className="save-btn">
              Save Service
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal; 