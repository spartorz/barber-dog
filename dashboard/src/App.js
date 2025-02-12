import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardHome from './pages/DashboardHome';
import ServicesManagement from './pages/ServicesManagement';
import { AppProvider } from '../../shared/context/AppContext';
import Sidebar from './components/Sidebar/Sidebar';
import './styles/dashboard.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="dashboard-container">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/services" element={<ServicesManagement />} />
              <Route path="/bookings" element={<BookingManagement />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App; 