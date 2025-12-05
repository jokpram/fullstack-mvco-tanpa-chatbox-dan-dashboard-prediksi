// components/Layout/Sidebar.tsx - UPDATE
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { COLORS, ICONS } from '../../utils/constants';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: ICONS.DASHBOARD,
      roles: ['mine_planner', 'shipping_planner']
    },
    {
      path: '/orders',
      label: user?.role === 'shipping_planner' ? 'All Orders' : 'My Orders',
      icon: ICONS.ORDER,
      roles: ['mine_planner', 'shipping_planner'] // Shipping planner bisa akses orders
    },
    {
      path: '/schedules',
      label: user?.role === 'shipping_planner' ? 'My Schedules' : 'Schedules',
      icon: ICONS.SCHEDULE,
      roles: ['mine_planner', 'shipping_planner']
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: ICONS.USER,
      roles: ['mine_planner', 'shipping_planner']
    }
  ];

  const filteredItems = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <ICONS.LOGO size={24} />
            <span className="logo-text">MS Planner</span>
          </div>
          {onClose && (
            <button className="close-btn" onClick={onClose}>
              <ICONS.CLOSE size={20} />
            </button>
          )}
        </div>

        <div className="user-info">
          <div className="avatar">
            {user?.nama.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.nama}</div>
            <div className="user-role">
              <span className={`role-badge ${user?.role}`}>
                {user?.role === 'mine_planner' ? (
                  <><ICONS.MINE_PLANNER size={12} /> Mine Planner</>
                ) : (
                  <><ICONS.SHIPPING_PLANNER size={12} /> Shipping Planner</>
                )}
              </span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {filteredItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <item.icon className="nav-icon" size={18} />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <ICONS.LOGOUT size={16} />
            <span>Logout</span>
          </button>
        </div>

        <style jsx>{`
          .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            display: none;
          }
          
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 280px;
            background: ${COLORS.background};
            border-right: 1px solid ${COLORS.border};
            display: flex;
            flex-direction: column;
            z-index: 1000;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            overflow-y: auto;
          }
          
          .sidebar.open {
            transform: translateX(0);
          }
          
          .sidebar-header {
            padding: 20px;
            border-bottom: 1px solid ${COLORS.border};
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            color: ${COLORS.primary};
            font-weight: 700;
            font-size: 18px;
          }
          
          .close-btn {
            background: none;
            border: none;
            color: ${COLORS.textLight};
            cursor: pointer;
            padding: 4px;
            line-height: 1;
          }
          
          .close-btn:hover {
            color: ${COLORS.text};
          }
          
          .user-info {
            padding: 24px 20px;
            border-bottom: 1px solid ${COLORS.border};
            display: flex;
            align-items: center;
            gap: 12px;
          }
          
          .avatar {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary});
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 18px;
          }
          
          .user-details {
            flex: 1;
          }
          
          .user-name {
            font-weight: 600;
            color: ${COLORS.text};
            margin-bottom: 4px;
          }
          
          .role-badge {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 2px 8px;
            background: ${COLORS.backgroundSecondary};
            border: 1px solid ${COLORS.border};
            border-radius: 12px;
            font-size: 12px;
            color: ${COLORS.textLight};
          }
          
          .role-badge.mine_planner {
            background: rgba(106, 63, 181, 0.1);
            border-color: rgba(106, 63, 181, 0.2);
            color: ${COLORS.primary};
          }
          
          .role-badge.shipping_planner {
            background: rgba(246, 201, 75, 0.1);
            border-color: rgba(246, 201, 75, 0.2);
            color: ${COLORS.secondaryDark};
          }
          
          .sidebar-nav {
            flex: 1;
            padding: 20px 0;
            overflow-y: auto;
          }
          
          .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            color: ${COLORS.textLight};
            text-decoration: none;
            transition: all 0.2s;
            border-left: 3px solid transparent;
          }
          
          .nav-item:hover {
            background: ${COLORS.backgroundSecondary};
            color: ${COLORS.text};
          }
          
          .nav-item.active {
            background: rgba(106, 63, 181, 0.05);
            color: ${COLORS.primary};
            border-left-color: ${COLORS.primary};
          }
          
          .nav-icon {
            width: 24px;
            text-align: center;
          }
          
          .nav-label {
            font-weight: 500;
            font-size: 14px;
          }
          
          .sidebar-footer {
            padding: 20px;
            border-top: 1px solid ${COLORS.border};
          }
          
          .logout-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 12px 16px;
            background: transparent;
            border: 1px solid ${COLORS.border};
            border-radius: 8px;
            color: ${COLORS.textLight};
            cursor: pointer;
            transition: all 0.2s;
            font-size: 14px;
            font-weight: 500;
          }
          
          .logout-btn:hover {
            background: ${COLORS.backgroundSecondary};
            color: ${COLORS.text};
            border-color: ${COLORS.textLight};
          }
          
          @media (max-width: 768px) {
            .sidebar-overlay {
              display: block;
            }
            
            .sidebar {
              box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
            }
          }
          
          @media (min-width: 769px) {
            .sidebar {
              position: sticky;
              top: 0;
              height: 100vh;
              transform: translateX(0);
            }
            
            .close-btn {
              display: none;
            }
          }
        `}</style>
      </aside>
    </>
  );
};

export default Sidebar;