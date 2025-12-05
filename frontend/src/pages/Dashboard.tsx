//Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/order.service';
import { scheduleService } from '../services/schedule.service';
import { Order, Schedule } from '../types';
import { COLORS, ORDER_STATUS, SCHEDULE_STATUS, ICONS } from '../utils/constants';
import { formatDate, formatCurrency, getStatusColor } from '../utils/helpers';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSchedules: 0,
    pendingOrders: 0,
    activeSchedules: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentSchedules, setRecentSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      if (user?.role === 'mine_planner') {
        const ordersResponse = await orderService.getMyOrders();
        const orders = ordersResponse.orders || [];
        setRecentOrders(orders.slice(0, 5));
        setStats({
          totalOrders: orders.length,
          totalSchedules: 0,
          pendingOrders: orders.filter(o => o.status === ORDER_STATUS.CREATED).length,
          activeSchedules: 0
        });
      } else if (user?.role === 'shipping_planner') {
        const schedulesResponse = await scheduleService.getSchedules();
        const schedules = schedulesResponse.schedules || [];
        setRecentSchedules(schedules.slice(0, 5));
        setStats({
          totalOrders: 0,
          totalSchedules: schedules.length,
          pendingOrders: 0,
          activeSchedules: schedules.filter(s => s.status === SCHEDULE_STATUS.ONGOING).length
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.nama}!</h1>
        <p>Here's what's happening with your {user?.role === 'mine_planner' ? 'orders' : 'schedules'} today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: `${COLORS.primary}20`, color: COLORS.primary }}>
            {user?.role === 'mine_planner' ? <ICONS.ORDER size={24} /> : <ICONS.SCHEDULE size={24} />}
          </div>
          <div className="stat-content">
            <h3>{user?.role === 'mine_planner' ? stats.totalOrders : stats.totalSchedules}</h3>
            <p>{user?.role === 'mine_planner' ? 'Total Orders' : 'Total Schedules'}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: `${COLORS.secondary}20`, color: COLORS.secondary }}>
            {user?.role === 'mine_planner' ? <ICONS.ACTIONS.TIME size={24} /> : <ICONS.TRANSPORT.TRUCK size={24} />}
          </div>
          <div className="stat-content">
            <h3>{user?.role === 'mine_planner' ? stats.pendingOrders : stats.activeSchedules}</h3>
            <p>{user?.role === 'mine_planner' ? 'Pending Orders' : 'Active Schedules'}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: `${COLORS.success}20`, color: COLORS.success }}>
            <ICONS.FINANCE size={24} />
          </div>
          <div className="stat-content">
            <h3>
              {user?.role === 'mine_planner' 
                ? formatCurrency(recentOrders.reduce((sum, order) => sum + (order.estimated_cost_usd || 0), 0))
                : formatCurrency(recentSchedules.reduce((sum, schedule) => sum + (schedule.cost_usd || 0), 0))
              }
            </h3>
            <p>Total Value</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: `${COLORS.info}20`, color: COLORS.info }}>
            <ICONS.SCHEDULE size={24} />
          </div>
          <div className="stat-content">
            <h3>{formatDate(new Date(), 'dd/MM')}</h3>
            <p>Today's Date</p>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h2>Recent {user?.role === 'mine_planner' ? 'Orders' : 'Schedules'}</h2>
        
        {user?.role === 'mine_planner' ? (
          recentOrders.length > 0 ? (
            <div className="recent-list">
              {recentOrders.map(order => (
                <div key={order.id} className="recent-item">
                  <div className="recent-item-header">
                    <h4>{order.order_code}</h4>
                    <span className="status-badge" style={{ background: getStatusColor(order.status) }}>
                      {order.status}
                    </span>
                  </div>
                  <p>{order.origin} → {order.destination}</p>
                  <div className="recent-item-details">
                    <span>{order.cargo_type} ({order.cargo_weight_tons} tons)</span>
                    <span>{formatCurrency(order.estimated_cost_usd || 0)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">
              <ICONS.ORDER size={32} />
              No orders yet. Create your first order!
            </p>
          )
        ) : (
          recentSchedules.length > 0 ? (
            <div className="recent-list">
              {recentSchedules.map(schedule => (
                <div key={schedule.id} className="recent-item">
                  <div className="recent-item-header">
                    <h4>Schedule #{schedule.id.slice(0, 8)}</h4>
                    <span className="status-badge" style={{ background: getStatusColor(schedule.status) }}>
                      {schedule.status}
                    </span>
                  </div>
                  <p>Order: {schedule.order?.order_code || schedule.orderId}</p>
                  <div className="recent-item-details">
                    <span>{schedule.vehicle_id || schedule.vessel_name || 'No vehicle'}</span>
                    {schedule.departure_time && (
                      <span>{formatDate(schedule.departure_time, 'dd/MM')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">
              <ICONS.SCHEDULE size={32} />
              No schedules yet. Create your first schedule!
            </p>
          )
        )}
      </div>

      <style jsx>{`
        .dashboard {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .dashboard-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid ${COLORS.border};
          border-top-color: ${COLORS.primary};
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .dashboard-header {
          margin-bottom: 32px;
        }
        
        .dashboard-header h1 {
          margin: 0 0 8px 0;
          color: ${COLORS.text};
          font-size: 28px;
          font-weight: 700;
        }
        
        .dashboard-header p {
          margin: 0;
          color: ${COLORS.textLight};
          font-size: 16px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .stat-card {
          background: ${COLORS.background};
          border: 1px solid ${COLORS.border};
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .stat-content h3 {
          margin: 0 0 4px 0;
          color: ${COLORS.text};
          font-size: 24px;
          font-weight: 700;
        }
        
        .stat-content p {
          margin: 0;
          color: ${COLORS.textLight};
          font-size: 14px;
        }
        
        .recent-section {
          background: ${COLORS.background};
          border: 1px solid ${COLORS.border};
          border-radius: 12px;
          padding: 24px;
        }
        
        .recent-section h2 {
          margin: 0 0 20px 0;
          color: ${COLORS.text};
          font-size: 20px;
          font-weight: 600;
        }
        
        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .recent-item {
          padding: 16px;
          border: 1px solid ${COLORS.border};
          border-radius: 8px;
          transition: background 0.2s;
        }
        
        .recent-item:hover {
          background: ${COLORS.backgroundSecondary};
        }
        
        .recent-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .recent-item-header h4 {
          margin: 0;
          color: ${COLORS.text};
          font-size: 16px;
          font-weight: 600;
        }
        
        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
          font-weight: 500;
        }
        
        .recent-item p {
          margin: 0 0 8px 0;
          color: ${COLORS.textLight};
          font-size: 14px;
        }
        
        .recent-item-details {
          display: flex;
          justify-content: space-between;
          color: ${COLORS.text};
          font-size: 14px;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
          padding: 40px;
          color: ${COLORS.textLight};
          font-size: 16px;
        }
        
        .empty-state svg {
          color: ${COLORS.border};
        }
        
        @media (max-width: 768px) {
          .dashboard {
            padding: 16px;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .stat-card {
            flex-direction: column;
            text-align: center;
          }
        }
        
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;