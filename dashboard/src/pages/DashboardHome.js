import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DashboardHome.css';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    todayBookings: 0,
    revenue: 0
  });

  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // API calls will go here
      // For now using dummy data
      setStats({
        totalBookings: 150,
        pendingBookings: 5,
        todayBookings: 8,
        revenue: 1500
      });

      setRecentBookings([
        {
          id: 1,
          customerName: "John Doe",
          service: "Full Grooming",
          date: "2024-03-20",
          status: "pending"
        },
        // Add more bookings...
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <section className="welcome-section">
        <h1>Welcome Back, Admin</h1>
        <p>Here's what's happening today</p>
      </section>

      {/* Stats Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <h3>Today's Bookings</h3>
          <span className="stat-number">{stats.todayBookings}</span>
        </div>
        <div className="stat-card">
          <h3>Pending Approvals</h3>
          <span className="stat-number">{stats.pendingBookings}</span>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <span className="stat-number">{stats.totalBookings}</span>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <span className="stat-number">${stats.revenue}</span>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/dashboard/bookings/new" className="action-card">
            <span className="icon">📅</span>
            <span>New Booking</span>
          </Link>
          <Link to="/dashboard/services" className="action-card">
            <span className="icon">✂️</span>
            <span>Manage Services</span>
          </Link>
          <Link to="/dashboard/calendar" className="action-card">
            <span className="icon">📊</span>
            <span>View Calendar</span>
          </Link>
          <Link to="/dashboard/settings" className="action-card">
            <span className="icon">⚙️</span>
            <span>Settings</span>
          </Link>
        </div>
      </section>

      {/* Recent Bookings */}
      <section className="recent-bookings">
        <div className="section-header">
          <h2>Recent Bookings</h2>
          <Link to="/dashboard/bookings" className="view-all">View All</Link>
        </div>
        <div className="bookings-table">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.customerName}</td>
                  <td>{booking.service}</td>
                  <td>{booking.date}</td>
                  <td>
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardHome; 