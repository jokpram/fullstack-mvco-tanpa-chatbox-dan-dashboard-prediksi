// pages/Schedules.tsx - UPDATE untuk menangani kedua role
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { scheduleService } from '@/services/schedule.service';
import { orderService } from '@/services/order.service';
import ScheduleForm from '@/components/Schedules/ScheduleForm';
import ScheduleList from '@/components/Schedules/ScheduleList';
import ScheduleDetailModal from '@/components/Schedules/ScheduleDetailModal';
import { Schedule, ScheduleFormData, UpdateScheduleData, Order } from '@/types';
import { COLORS } from '@/utils/constants';

const Schedules: React.FC = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [showScheduleDetail, setShowScheduleDetail] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load schedules based on role
      const schedulesResponse = await scheduleService.getSchedules();
      setSchedules(schedulesResponse.schedules || []);
      
      // Load orders for shipping planner to create schedules
      if (user?.role === 'shipping_planner') {
        const ordersResponse = await orderService.getAllOrders();
        setOrders(ordersResponse.orders || []);
      }
      
    } catch (err: any) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSchedule = async (data: ScheduleFormData) => {
    try {
      setIsCreating(true);
      await scheduleService.createSchedule(data);
      await loadData();
      setShowForm(false);
      setSuccessMessage('Schedule created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create schedule');
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateSchedule = async (scheduleId: string, data: UpdateScheduleData) => {
    try {
      await scheduleService.updateSchedule(scheduleId, data);
      await loadData();
      setSuccessMessage('Schedule updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update schedule');
      throw err;
    }
  };

  const handleViewSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setShowScheduleDetail(true);
  };

  const refreshData = () => {
    loadData();
  };

  return (
    <div className="schedules-page">
      <div className="page-header">
        <div>
          <h1>Schedule Management</h1>
          <p>
            {user?.role === 'shipping_planner' 
              ? 'Manage and track shipping schedules' 
              : 'View schedules for your orders'}
          </p>
          {user?.role === 'mine_planner' && (
            <p className="role-info">Viewing schedules for your orders only</p>
          )}
        </div>
        <div className="header-actions">
          <button 
            onClick={refreshData} 
            className="refresh-btn"
            disabled={isLoading}
          >
            Refresh
          </button>
          {user?.role === 'shipping_planner' && (
            <button
              className="create-btn"
              onClick={() => setShowForm(!showForm)}
              disabled={isCreating}
            >
              {showForm ? 'Cancel' : '+ Create Schedule'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-alert">
          <span>⚠️</span>
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {successMessage && (
        <div className="success-alert">
          <span>✓</span>
          {successMessage}
          <button onClick={() => setSuccessMessage('')}>×</button>
        </div>
      )}

      {showForm && user?.role === 'shipping_planner' && (
        <div className="form-section">
          <h2>Create New Schedule</h2>
          <ScheduleForm
            onSubmit={handleCreateSchedule}
            isLoading={isCreating}
          />
        </div>
      )}

      <div className="schedules-section">
        <div className="section-header">
          <h2>
            {user?.role === 'shipping_planner' ? 'Your Schedules' : 'Order Schedules'} 
            <span className="count-badge">{schedules.length}</span>
          </h2>
        </div>
        
        {isLoading ? (
          <div className="loading">Loading schedules...</div>
        ) : schedules.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No schedules found</h3>
            <p>
              {user?.role === 'shipping_planner' 
                ? 'Create your first schedule to get started' 
                : 'No schedules found for your orders'}
            </p>
            {user?.role === 'shipping_planner' && (
              <button
                className="create-btn"
                onClick={() => setShowForm(true)}
              >
                + Create Schedule
              </button>
            )}
          </div>
        ) : (
          <ScheduleList
            schedules={schedules}
            onUpdateSchedule={handleUpdateSchedule}
            onViewSchedule={handleViewSchedule}
            canEdit={user?.role === 'shipping_planner'}
          />
        )}
      </div>

      {selectedSchedule && (
        <ScheduleDetailModal
          schedule={selectedSchedule}
          isOpen={showScheduleDetail}
          onClose={() => {
            setShowScheduleDetail(false);
            setSelectedSchedule(null);
          }}
        />
      )}

      <style jsx>{`
        .schedules-page {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }
        
        .page-header h1 {
          margin: 0 0 8px 0;
          color: ${COLORS.text};
          font-size: 28px;
          font-weight: 700;
        }
        
        .page-header p {
          margin: 0;
          color: ${COLORS.textLight};
          font-size: 16px;
        }
        
        .role-info {
          font-size: 14px !important;
          color: ${COLORS.primary} !important;
          font-weight: 500;
          margin-top: 4px !important;
        }
        
        .header-actions {
          display: flex;
          gap: 12px;
        }
        
        .refresh-btn {
          padding: 10px 20px;
          background: ${COLORS.backgroundSecondary};
          border: 1px solid ${COLORS.border};
          border-radius: 8px;
          color: ${COLORS.text};
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .refresh-btn:hover:not(:disabled) {
          background: ${COLORS.background};
          border-color: ${COLORS.primary};
          color: ${COLORS.primary};
        }
        
        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .create-btn {
          padding: 10px 24px;
          background: ${COLORS.primary};
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .create-btn:hover:not(:disabled) {
          background: ${COLORS.primaryDark};
        }
        
        .create-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .error-alert {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: ${COLORS.error};
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .error-alert button {
          margin-left: auto;
          background: none;
          border: none;
          color: ${COLORS.error};
          font-size: 18px;
          cursor: pointer;
        }
        
        .success-alert {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: ${COLORS.success};
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .success-alert button {
          margin-left: auto;
          background: none;
          border: none;
          color: ${COLORS.success};
          font-size: 18px;
          cursor: pointer;
        }
        
        .form-section {
          background: ${COLORS.background};
          border: 1px solid ${COLORS.border};
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
        }
        
        .form-section h2 {
          margin: 0 0 20px 0;
          color: ${COLORS.text};
          font-size: 20px;
          font-weight: 600;
        }
        
        .schedules-section {
          background: ${COLORS.background};
          border: 1px solid ${COLORS.border};
          border-radius: 12px;
          padding: 24px;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .section-header h2 {
          margin: 0;
          color: ${COLORS.text};
          font-size: 20px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .count-badge {
          background: ${COLORS.primary};
          color: white;
          padding: 2px 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .loading {
          text-align: center;
          padding: 40px;
          color: ${COLORS.textLight};
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 40px;
          background: ${COLORS.backgroundSecondary};
          border-radius: 12px;
        }
        
        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }
        
        .empty-state h3 {
          margin: 0 0 8px 0;
          color: ${COLORS.text};
          font-size: 18px;
          font-weight: 600;
        }
        
        .empty-state p {
          margin: 0 0 20px 0;
          color: ${COLORS.textLight};
        }
        
        @media (max-width: 768px) {
          .schedules-page {
            padding: 16px;
          }
          
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          
          .header-actions {
            width: 100%;
            justify-content: space-between;
          }
          
          .refresh-btn, .create-btn {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Schedules;