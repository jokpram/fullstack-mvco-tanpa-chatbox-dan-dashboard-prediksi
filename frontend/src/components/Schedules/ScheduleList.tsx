//ScheduleList.tsx
import React from 'react';
import { Schedule } from '@/types';
import ScheduleCard from './ScheduleCard';
import { COLORS, SCHEDULE_STATUS } from '@/utils/constants';

interface ScheduleListProps {
  schedules: Schedule[];
  onUpdateSchedule?: (scheduleId: string, data: any) => Promise<void>;
  onViewSchedule?: (schedule: Schedule) => void;
  canEdit?: boolean;
  isLoading?: boolean;
  emptyMessage?: string;
}

const ScheduleList: React.FC<ScheduleListProps> = ({
  schedules,
  onUpdateSchedule,
  onViewSchedule,
  canEdit = false,
  isLoading = false,
  emptyMessage = 'No schedules found'
}) => {
  if (isLoading) {
    return (
      <div className="schedule-list loading">
        <div className="loading-spinner"></div>
        <p>Loading schedules...</p>
        <style jsx>{`
          .schedule-list.loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
          }
          
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid ${COLORS.border};
            border-top-color: ${COLORS.primary};
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          p {
            color: ${COLORS.textLight};
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="schedule-list empty">
        <div className="empty-icon">📅</div>
        <h3>{emptyMessage}</h3>
        <p>Create your first schedule to get started</p>
        <style jsx>{`
          .schedule-list.empty {
            text-align: center;
            padding: 60px 20px;
            background: ${COLORS.background};
            border: 1px solid ${COLORS.border};
            border-radius: 12px;
          }
          
          .empty-icon {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.5;
          }
          
          h3 {
            margin: 0 0 8px 0;
            color: ${COLORS.text};
            font-size: 18px;
            font-weight: 600;
          }
          
          p {
            margin: 0;
            color: ${COLORS.textLight};
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  const statusCounts = {
    [SCHEDULE_STATUS.PLANNED]: schedules.filter(s => s.status === SCHEDULE_STATUS.PLANNED).length,
    [SCHEDULE_STATUS.ONGOING]: schedules.filter(s => s.status === SCHEDULE_STATUS.ONGOING).length,
    [SCHEDULE_STATUS.COMPLETED]: schedules.filter(s => s.status === SCHEDULE_STATUS.COMPLETED).length,
    [SCHEDULE_STATUS.DELAYED]: schedules.filter(s => s.status === SCHEDULE_STATUS.DELAYED).length,
    [SCHEDULE_STATUS.CANCELLED]: schedules.filter(s => s.status === SCHEDULE_STATUS.CANCELLED).length,
  };

  return (
    <div className="schedule-list">
      <div className="stats-bar">
        <div className="stats-grid">
          <div className="stat">
            <span className="label">Total</span>
            <span className="value">{schedules.length}</span>
          </div>
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="stat">
              <span className="label">{status}</span>
              <span className="value">{count}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="schedules-grid">
        {schedules.map(schedule => (
          <ScheduleCard
            key={schedule.id}
            schedule={schedule}
            onUpdate={onUpdateSchedule}
            onView={onViewSchedule}
            canEdit={canEdit}
          />
        ))}
      </div>

      <style jsx>{`
        .schedule-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .stats-bar {
          padding: 16px;
          background: ${COLORS.backgroundSecondary};
          border-radius: 8px;
          border: 1px solid ${COLORS.border};
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px;
          background: ${COLORS.background};
          border-radius: 6px;
          border: 1px solid ${COLORS.border};
        }
        
        .stat .label {
          font-size: 12px;
          color: ${COLORS.textLight};
          margin-bottom: 4px;
          text-align: center;
        }
        
        .stat .value {
          font-size: 20px;
          font-weight: 700;
          color: ${COLORS.text};
        }
        
        .schedules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
        }
        
        @media (max-width: 768px) {
          .schedules-grid {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
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

export default ScheduleList;