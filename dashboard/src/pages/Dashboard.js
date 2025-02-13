import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import BookingManagement from '../components/BookingManagement';
import BookingCalendar from '../components/BookingCalendar';
import Sidebar from '../components/Sidebar/Sidebar';
import ServiceList from '../components/Services/ServiceList';
import ProductList from '../components/Products/ProductList';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [items, setItems] = useState([]);
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchItems(activeTab);
    fetchServices();
    fetchProducts();
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

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleServiceUpdate = async (id, updatedData) => {
    // Implementation
  };

  const handleProductUpdate = async (id, updatedData) => {
    // Implementation
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">
        <h1>Welcome, {user.name}</h1>
        
        <section className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Services</h3>
            <p>{services.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Products</h3>
            <p>{products.length}</p>
          </div>
        </section>

        <section className="management-section">
          <h2>Services Management</h2>
          <ServiceList 
            services={services} 
            onUpdate={handleServiceUpdate}
            onDelete={handleServiceDelete}
          />
        </section>

        <section className="management-section">
          <h2>Products Management</h2>
          <ProductList 
            products={products}
            onUpdate={handleProductUpdate}
            onDelete={handleProductDelete}
          />
        </section>
      </main>
    </div>
  );
};

export default Dashboard; 