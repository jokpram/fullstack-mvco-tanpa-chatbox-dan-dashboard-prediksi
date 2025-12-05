//ScheduleCard.tsx
import React, { useState } from 'react';
import { Schedule, UpdateScheduleData } from '../../types';
import { formatDate, getStatusColor } from '../../utils/helpers';
import { SCHEDULE_STATUS, COLORS, ICONS } from '../../utils/constants';

interface ScheduleCardProps {
  schedule: Schedule;
  onUpdate?: (scheduleId: string, data: UpdateScheduleData) => Promise<void>;
  onView?: (schedule: Schedule) => void;
  canEdit?: boolean;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ 
  schedule, 
  onUpdate, 
  onView,
  canEdit = false 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateData, setUpdateData] = useState<UpdateScheduleData>({
    status: schedule.status,
    notes: schedule.notes || '',
    road_condition_status: schedule.road_condition_status,
    weather_condition: schedule.weather_condition
  });

  const statusColor = getStatusColor(schedule.status);

  const handleUpdate = async () => {
    if (!onUpdate) return;
    
    try {
      setIsUpdating(true);
      await onUpdate(schedule.id, updateData);
      setShowUpdateForm(false);
    } catch (error) {
      console.error('Failed to update schedule:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="schedule-card">
      <div className="card-header">
        <div className="schedule-id">
          <span className="label">Schedule ID:</span>
          <span className="value">
            <ICONS.SCHEDULE size={12} /> {schedule.id.slice(0, 8)}...
          </span>
        </div>
        <div className="status-badge" style={{ backgroundColor: statusColor }}>
          {schedule.status}
        </div>
      </div>

      <div className="card-content">
        <div className="info-row">
          <span className="label">
            <ICONS.ORDER size={12} /> Order:
          </span>
          <span className="value">{schedule.order?.order_code || schedule.orderId}</span>
        </div>

        {schedule.vehicle_id && (
          <div className="info-row">
            <span className="label">
              <ICONS.TRANSPORT.TRUCK size={12} /> Vehicle:
            </span>
            <span className="value">{schedule.vehicle_id}</span>
          </div>
        )}

        {schedule.vessel_name && (
          <div className="info-row">
            <span className="label">
              <ICONS.TRANSPORT.SHIP size={12} /> Vessel:
            </span>
            <span className="value">{schedule.vessel_name}</span>
          </div>
        )}

        <div className="timeline">
          {schedule.departure_time && (
            <div className="timeline-item">
              <span className="label">
                <ICONS.ACTIONS.TIME size={12} /> Departure:
              </span>
              <span className="value">{formatDate(schedule.departure_time)}</span>
            </div>
          )}
          
          {schedule.arrival_time && (
            <div className="timeline-item">
              <span className="label">
                <ICONS.ACTIONS.TIME size={12} /> Arrival:
              </span>
              <span className="value">{formatDate(schedule.arrival_time)}</span>
            </div>
          )}
        </div>

        <div className="conditions">
          {schedule.weather_condition && (
            <div className="condition">
              <ICONS.WEATHER.CLEAR size={14} />
              <span>{schedule.weather_condition}</span>
            </div>
          )}
          
          {schedule.road_condition_status && (
            <div className="condition">
              <ICONS.ROAD.GOOD size={14} />
              <span>{schedule.road_condition_status}</span>
            </div>
          )}
        </div>

        {schedule.cost_usd && (
          <div className="cost">
            <span className="label">
              <ICONS.FINANCE size={12} /> Cost:
            </span>
            <span className="value">${schedule.cost_usd.toLocaleString()}</span>
          </div>
        )}

        {schedule.notes && (
          <div className="notes">
            <span className="label">
              <ICONS.INFO size={12} /> Notes:
            </span>
            <span className="value">{schedule.notes}</span>
          </div>
        )}
      </div>

      <div className="card-actions">
        {onView && (
          <button onClick={() => onView(schedule)} className="btn btn-view">
            <ICONS.ACTIONS.SEARCH size={12} /> View Details
          </button>
        )}
        
        {canEdit && onUpdate && (
          <>
            {!showUpdateForm ? (
              <button onClick={() => setShowUpdateForm(true)} className="btn btn-edit">
                <ICONS.ACTIONS.EDIT size={12} /> Update
              </button>
            ) : (
              <div className="update-form">
                <div className="form-group">
                  <select
                    value={updateData.status}
                    onChange={(e) => setUpdateData(prev => ({ 
                      ...prev, 
                      status: e.target.value as Schedule['status'] 
                    }))}
                    className="status-select"
                  >
                    {Object.values(SCHEDULE_STATUS).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-actions">
                  <button onClick={handleUpdate} disabled={isUpdating} className="btn btn-save">
                    {isUpdating ? (
                      <>
                        <span className="spinner"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <ICONS.SUCCESS size={12} /> Save
                      </>
                    )}
                  </button>
                  <button onClick={() => setShowUpdateForm(false)} className="btn btn-cancel">
                    <ICONS.CLOSE size={12} /> Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .schedule-card {
          background: ${COLORS.background};
          border: 1px solid ${COLORS.border};
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s;
        }
        
        .schedule-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .schedule-id {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .schedule-id .label {
          font-size: 12px;
          color: ${COLORS.textLight};
        }
        
        .schedule-id .value {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 13px;
          color: ${COLORS.text};
        }
        
        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          color: white;
          font-size: 12px;
          font-weight: 500;
        }
        
        .card-content {
          margin-bottom: 16px;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .info-row .label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: ${COLORS.textLight};
        }
        
        .info-row .value {
          font-size: 13px;
          color: ${COLORS.text};
          font-weight: 500;
        }
        
        .timeline {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin: 12px 0;
          padding: 12px;
          background: ${COLORS.backgroundSecondary};
          border-radius: 6px;
        }
        
        .timeline-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .conditions {
          display: flex;
          gap: 12px;
          margin: 12px 0;
          padding-top: 12px;
          border-top: 1px solid ${COLORS.border};
        }
        
        .condition {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          color: ${COLORS.textLight};
        }
        
        .cost, .notes {
          display: flex;
          gap: 8px;
          margin-top: 8px;
          font-size: 13px;
        }
        
        .cost .label, .notes .label {
          display: flex;
          align-items: center;
          gap: 6px;
          color: ${COLORS.textLight};
        }
        
        .cost .value, .notes .value {
          color: ${COLORS.text};
          font-weight: 500;
        }
        
        .notes .value {
          flex: 1;
          font-style: italic;
        }
        
        .card-actions {
          padding-top: 16px;
          border-top: 1px solid ${COLORS.border};
        }
        
        .btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        
        .btn-view {
          background: ${COLORS.primary};
          color: white;
          width: 100%;
        }
        
        .btn-view:hover {
          background: ${COLORS.primaryDark};
        }
        
        .btn-edit {
          background: transparent;
          border-color: ${COLORS.primary};
          color: ${COLORS.primary};
          width: 100%;
          margin-top: 8px;
        }
        
        .btn-edit:hover {
          background: ${COLORS.primary};
          color: white;
        }
        
        .update-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 12px;
        }
        
        .form-group select {
          width: 100%;
          padding: 6px 8px;
          border: 1px solid ${COLORS.border};
          border-radius: 4px;
          font-size: 12px;
          background: white;
        }
        
        .form-actions {
          display: flex;
          gap: 8px;
        }
        
        .btn-save {
          background: ${COLORS.success};
          color: white;
          flex: 2;
        }
        
        .btn-save:hover:not(:disabled) {
          background: #0da271;
        }
        
        .btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .btn-cancel {
          background: transparent;
          border-color: ${COLORS.textLight};
          color: ${COLORS.textLight};
          flex: 1;
        }
        
        .btn-cancel:hover {
          background: ${COLORS.textLight};
          color: white;
        }
        
        .spinner {
          width: 12px;
          height: 12px;
          border: 2px solid white;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ScheduleCard;