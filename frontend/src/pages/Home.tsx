//Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { COLORS, ICONS } from '@/utils/constants';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Mining Value Chain Optimization</h1>
          <p className="subtitle">
            Streamline your mining operations and shipping logistics with our integrated platform
          </p>
          
          {!isAuthenticated ? (
            <div className="cta-buttons">
              <Link to="/register/mine" className="btn btn-primary">
                <ICONS.MINE_PLANNER size={20} />
                Register as Mine Planner
              </Link>
              <Link to="/register/shipping" className="btn btn-secondary">
                <ICONS.SHIPPING_PLANNER size={20} />
                Register as Shipping Planner
              </Link>
              <Link to="/login" className="btn btn-outline">
                Sign In to Existing Account
              </Link>
            </div>
          ) : (
            <div className="welcome-section">
              <h2>Welcome back, {user?.nama}!</h2>
              <p>You are logged in as a {user?.role === 'mine_planner' ? 'Mine Planner' : 'Shipping Planner'}</p>
              <div className="dashboard-links">
                <Link to="/dashboard" className="btn btn-primary">
                  Go to Dashboard
                </Link>
                <Link to={user?.role === 'mine_planner' ? '/orders' : '/schedules'} className="btn btn-outline">
                  Manage {user?.role === 'mine_planner' ? 'Orders' : 'Schedules'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2>Platform Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <ICONS.ORDER size={32} />
              </div>
              <h3>Order Management</h3>
              <p>Create and manage mining orders with detailed specifications including cargo type, weight, and transport requirements.</p>
              <ul className="feature-list">
                <li>Real-time order tracking</li>
                <li>Cost estimation</li>
                <li>Production metrics</li>
                <li>Environmental impact tracking</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <ICONS.SCHEDULE size={32} />
              </div>
              <h3>Schedule Optimization</h3>
              <p>Plan and optimize shipping schedules with comprehensive weather, road, equipment, and vessel monitoring.</p>
              <ul className="feature-list">
                <li>Weather condition integration</li>
                <li>Road condition monitoring</li>
                <li>Equipment status tracking</li>
                <li>Vessel performance analytics</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <ICONS.DASHBOARD size={32} />
              </div>
              <h3>Analytics & Reporting</h3>
              <p>Gain insights with detailed analytics on operations, costs, efficiency, and environmental impact.</p>
              <ul className="feature-list">
                <li>Production efficiency reports</li>
                <li>Fuel consumption analysis</li>
                <li>CO2 emission tracking</li>
                <li>Cost optimization insights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="data-section">
        <div className="container">
          <h2>Comprehensive Data Integration</h2>
          <div className="data-categories">
            <div className="category">
              <h4>Weather Data</h4>
              <p>Temperature, humidity, rainfall, wind speed, visibility, pressure, sea state, and storm warnings.</p>
            </div>
            <div className="category">
              <h4>Road Conditions</h4>
              <p>Surface type, traffic density, flood levels, access status, dust levels, and maintenance activities.</p>
            </div>
            <div className="category">
              <h4>Equipment Monitoring</h4>
              <p>Machine status, engine parameters, fuel consumption, vibration levels, and maintenance requirements.</p>
            </div>
            <div className="category">
              <h4>Vessel Tracking</h4>
              <p>Cargo details, port conditions, crew availability, fuel consumption, and voyage analytics.</p>
            </div>
            <div className="category">
              <h4>Logistics Analytics</h4>
              <p>Route optimization, travel time, fuel costs, delivery status, and delay analysis.</p>
            </div>
            <div className="category">
              <h4>Production Metrics</h4>
              <p>Production output, downtime tracking, equipment efficiency, incident reports, and cost analysis.</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .home-page {
          min-height: 100vh;
        }
        
        .hero-section {
          background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%);
          color: white;
          padding: 80px 20px;
          text-align: center;
        }
        
        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .hero-section h1 {
          font-size: 48px;
          margin-bottom: 20px;
          font-weight: 700;
        }
        
        .subtitle {
          font-size: 20px;
          margin-bottom: 40px;
          opacity: 0.9;
        }
        
        .cta-buttons {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 400px;
          margin: 0 auto;
        }
        
        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s;
        }
        
        .btn-primary {
          background: white;
          color: ${COLORS.primary};
        }
        
        .btn-primary:hover {
          background: ${COLORS.backgroundSecondary};
          transform: translateY(-2px);
        }
        
        .btn-secondary {
          background: ${COLORS.secondary};
          color: ${COLORS.text};
        }
        
        .btn-secondary:hover {
          background: ${COLORS.secondaryDark};
          transform: translateY(-2px);
        }
        
        .btn-outline {
          background: transparent;
          border: 2px solid white;
          color: white;
        }
        
        .btn-outline:hover {
          background: white;
          color: ${COLORS.primary};
          transform: translateY(-2px);
        }
        
        .welcome-section {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 40px;
          backdrop-filter: blur(10px);
        }
        
        .welcome-section h2 {
          margin-bottom: 12px;
        }
        
        .welcome-section p {
          margin-bottom: 24px;
          opacity: 0.9;
        }
        
        .dashboard-links {
          display: flex;
          gap: 16px;
          justify-content: center;
        }
        
        .features-section {
          padding: 80px 20px;
          background: ${COLORS.backgroundSecondary};
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .features-section h2 {
          text-align: center;
          margin-bottom: 48px;
          font-size: 36px;
          color: ${COLORS.text};
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
        }
        
        .feature-card {
          background: ${COLORS.background};
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s;
        }
        
        .feature-card:hover {
          transform: translateY(-4px);
        }
        
        .feature-icon {
          background: ${COLORS.primary}20;
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          color: ${COLORS.primary};
        }
        
        .feature-card h3 {
          margin-bottom: 16px;
          color: ${COLORS.text};
        }
        
        .feature-card p {
          margin-bottom: 20px;
          color: ${COLORS.textLight};
          line-height: 1.6;
        }
        
        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .feature-list li {
          padding: 8px 0;
          color: ${COLORS.textLight};
          display: flex;
          align-items: center;
        }
        
        .feature-list li:before {
          content: '✓';
          color: ${COLORS.success};
          margin-right: 8px;
          font-weight: bold;
        }
        
        .data-section {
          padding: 80px 20px;
          background: ${COLORS.background};
        }
        
        .data-section h2 {
          text-align: center;
          margin-bottom: 48px;
          font-size: 36px;
          color: ${COLORS.text};
        }
        
        .data-categories {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }
        
        .category {
          background: ${COLORS.backgroundSecondary};
          border-radius: 8px;
          padding: 24px;
          border-left: 4px solid ${COLORS.primary};
        }
        
        .category h4 {
          margin-bottom: 12px;
          color: ${COLORS.primary};
        }
        
        .category p {
          color: ${COLORS.textLight};
          line-height: 1.6;
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 36px;
          }
          
          .subtitle {
            font-size: 18px;
          }
          
          .dashboard-links {
            flex-direction: column;
          }
          
          .cta-buttons {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;