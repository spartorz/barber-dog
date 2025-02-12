import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import BookingManagement from '../components/BookingManagement';
import BookingCalendar from '../components/BookingCalendar';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [items, setItems] = useState([]);
  const [view, setView] = useState('list'); // 'list' or 'calendar'

  useEffect(() => {
    fetchItems(activeTab);
  }, [activeTab]);

  const fetchItems = async (type) => {
    try {
      const response = await fetch(`/api/${type}`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="dashboard">
      {/* Simple Navigation */}
      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'services' ? 'active' : ''}
          onClick={() => setActiveTab('services')}
        >
          Services
        </button>
        <button 
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button 
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="header">
          <h1>{activeTab === 'services' ? 'Services' : activeTab === 'products' ? 'Products' : 'Bookings'}</h1>
          <button className="add-btn">
            Add New {activeTab === 'services' ? 'Service' : activeTab === 'products' ? 'Product' : 'Booking'}
          </button>
        </div>

        {/* View Toggle */}
        <div className="view-toggle">
          <button 
            className={view === 'list' ? 'active' : ''} 
            onClick={() => setView('list')}
          >
            List View
          </button>
          <button 
            className={view === 'calendar' ? 'active' : ''} 
            onClick={() => setView('calendar')}
          >
            Calendar View
          </button>
        </div>

        {/* Items Grid */}
        <div className="items-grid">
          {activeTab === 'services' && items.map(item => (
            <div key={item.id} className="item-card">
              <img src={item.imageUrl} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p className="price">${item.price}</p>
              <div className="card-actions">
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
          {activeTab === 'products' && items.map(item => (
            <div key={item.id} className="item-card">
              <img src={item.imageUrl} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p className="price">${item.price}</p>
              <div className="card-actions">
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
          {activeTab === 'bookings' && (
            view === 'list' ? <BookingManagement /> : <BookingCalendar />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 