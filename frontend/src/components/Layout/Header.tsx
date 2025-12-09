// components/Layout/Header.tsx - UPDATE
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { COLORS, ICONS } from '../../utils/constants';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <ICONS.LOGO className="logo-icon" size={24} />
            <span className="logo-text">Mining Value Chain Optimization Platform</span>
          </Link>
        </div>

        <nav className="nav">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              
              {/* AI Dashboard untuk kedua role */}
              <Link to="/ai-dashboard" className="nav-link">
                <ICONS.DASHBOARD size={16} /> AI Dashboard
              </Link>
              
              {/* Shipping planner bisa melihat orders */}
              {user?.role === 'shipping_planner' && (
                <Link to="/orders" className="nav-link">All Orders</Link>
              )}
              
              {user?.role === 'mine_planner' && (
                <>
                  <Link to="/orders" className="nav-link">My Orders</Link>
                  <Link to="/schedules" className="nav-link">Schedules</Link>
                </>
              )}
              
              {user?.role === 'shipping_planner' && (
                <Link to="/schedules" className="nav-link">My Schedules</Link>
              )}
              
              <div className="user-menu">
                <span className="user-name">
                  <ICONS.USER size={16} />
                  {user?.nama}
                </span>
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item">
                    <ICONS.USER size={14} /> Profile
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <ICONS.LOGOUT size={14} /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <div className="register-buttons">
                <Link to="/register/mine" className="btn btn-outline">
                  <ICONS.MINE_PLANNER size={16} /> Register as Mine Planner
                </Link>
                <Link to="/register/shipping" className="btn btn-primary">
                  <ICONS.SHIPPING_PLANNER size={16} /> Register as Shipping
                </Link>
              </div>
            </>
          )}
        </nav>
      </div>

      <style jsx>{`
        .header {
          background: ${COLORS.background};
          border-bottom: 1px solid ${COLORS.border};
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .logo a {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: ${COLORS.primary};
          font-weight: 700;
          font-size: 1.25rem;
        }
        
        .logo-icon {
          margin-right: 10px;
          color: ${COLORS.primary};
        }
        
        .logo-text {
          background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .nav {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        
        .nav-link {
          color: ${COLORS.text};
          text-decoration: none;
          font-weight: 500;
          padding: 8px 12px;
          border-radius: 6px;
          transition: all 0.2s;
        }
        
        .nav-link:hover {
          background: ${COLORS.backgroundSecondary};
          color: ${COLORS.primary};
        }
        
        .user-menu {
          position: relative;
          display: inline-block;
        }
        
        .user-name {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: ${COLORS.backgroundSecondary};
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: ${COLORS.background};
          border: 1px solid ${COLORS.border};
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          min-width: 160px;
          display: none;
          z-index: 1000;
        }
        
        .user-menu:hover .user-dropdown {
          display: block;
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          text-decoration: none;
          color: ${COLORS.text};
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 14px;
        }
        
        .dropdown-item:hover {
          background: ${COLORS.backgroundSecondary};
        }
        
        .dropdown-item.logout {
          color: ${COLORS.error};
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
          font-size: 14px;
        }
        
        .btn-primary {
          background: ${COLORS.primary};
          color: white;
        }
        
        .btn-primary:hover {
          background: ${COLORS.primaryDark};
        }
        
        .btn-outline {
          background: transparent;
          border-color: ${COLORS.primary};
          color: ${COLORS.primary};
        }
        
        .btn-outline:hover {
          background: ${COLORS.primary};
          color: white;
        }
        
        .register-buttons {
          display: flex;
          gap: 12px;
        }
        
        @media (max-width: 768px) {
          .header-container {
            padding: 0 16px;
          }
          
          .nav {
            gap: 12px;
          }
          
          .register-buttons {
            flex-direction: column;
            gap: 8px;
          }
          
          .logo-text {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
