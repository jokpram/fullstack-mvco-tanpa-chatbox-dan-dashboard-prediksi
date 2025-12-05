//ScheduleDetailModal.tsx
import React from 'react';
import { Schedule } from '@/types';
import { formatDate, getStatusColor } from '@/utils/helpers';
import { COLORS, ICONS } from '@/utils/constants';

interface ScheduleDetailModalProps {
  schedule: Schedule | null;
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleDetailModal: React.FC<ScheduleDetailModalProps> = ({ schedule, isOpen, onClose }) => {
  if (!schedule || !isOpen) return null;

  const statusColor = getStatusColor(schedule.status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Schedule Details</h2>
          <button className="close-btn" onClick={onClose}>
            <ICONS.CLOSE size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="detail-section">
            <h3>Basic Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Schedule ID:</span>
                <span className="value">{schedule.id}</span>
              </div>
              <div className="detail-item">
                <span className="label">Status:</span>
                <span className="status-badge" style={{ backgroundColor: statusColor }}>
                  {schedule.status}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Created:</span>
                <span className="value">{formatDate(schedule.createdAt)}</span>
              </div>
              {schedule.cost_usd && (
                <div className="detail-item">
                  <span className="label">Cost:</span>
                  <span className="value">${schedule.cost_usd.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {schedule.order && (
            <div className="detail-section">
              <h3>Order Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Order Code:</span>
                  <span className="value">{schedule.order.order_code}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Cargo Type:</span>
                  <span className="value">{schedule.order.cargo_type}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Weight:</span>
                  <span className="value">{schedule.order.cargo_weight_tons} tons</span>
                </div>
                <div className="detail-item">
                  <span className="label">Route:</span>
                  <span className="value">{schedule.order.origin} → {schedule.order.destination}</span>
                </div>
              </div>
            </div>
          )}

          <div className="detail-section">
            <h3>Transport Information</h3>
            <div className="detail-grid">
              {schedule.vehicle_id && (
                <div className="detail-item">
                  <span className="label">Vehicle ID:</span>
                  <span className="value">{schedule.vehicle_id}</span>
                </div>
              )}
              {schedule.vessel_name && (
                <div className="detail-item">
                  <span className="label">Vessel Name:</span>
                  <span className="value">{schedule.vessel_name}</span>
                </div>
              )}
              {schedule.machine_type && (
                <div className="detail-item">
                  <span className="label">Machine Type:</span>
                  <span className="value">{schedule.machine_type}</span>
                </div>
              )}
            </div>
          </div>

          {(schedule.departure_time || schedule.arrival_time) && (
            <div className="detail-section">
              <h3>Timing</h3>
              <div className="detail-grid">
                {schedule.departure_time && (
                  <div className="detail-item">
                    <span className="label">Departure Time:</span>
                    <span className="value">{formatDate(schedule.departure_time)}</span>
                  </div>
                )}
                {schedule.arrival_time && (
                  <div className="detail-item">
                    <span className="label">Arrival Time:</span>
                    <span className="value">{formatDate(schedule.arrival_time)}</span>
                  </div>
                )}
                {schedule.planned_duration_hours && (
                  <div className="detail-item">
                    <span className="label">Planned Duration:</span>
                    <span className="value">{schedule.planned_duration_hours} hours</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {(schedule.weather_condition || schedule.road_condition_status) && (
            <div className="detail-section">
              <h3>Conditions</h3>
              <div className="detail-grid">
                {schedule.weather_condition && (
                  <div className="detail-item">
                    <span className="label">Weather Condition:</span>
                    <span className="value">{schedule.weather_condition}</span>
                  </div>
                )}
                {schedule.road_condition_status && (
                  <div className="detail-item">
                    <span className="label">Road Condition:</span>
                    <span className="value">{schedule.road_condition_status}</span>
                  </div>
                )}
                {schedule.temperature_c !== null && (
                  <div className="detail-item">
                    <span className="label">Temperature:</span>
                    <span className="value">{schedule.temperature_c}°C</span>
                  </div>
                )}
                {schedule.humidity_percent !== null && (
                  <div className="detail-item">
                    <span className="label">Humidity:</span>
                    <span className="value">{schedule.humidity_percent}%</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {schedule.notes && (
            <div className="detail-section">
              <h3>Notes</h3>
              <div className="notes-content">
                {schedule.notes}
              </div>
            </div>
          )}

          {/* Weather details */}
          {(schedule.rainfall_mm || schedule.wind_speed_mps || schedule.visibility_km) && (
            <div className="detail-section">
              <h3>Weather Details</h3>
              <div className="detail-grid">
                {schedule.rainfall_mm !== null && (
                  <div className="detail-item">
                    <span className="label">Rainfall:</span>
                    <span className="value">{schedule.rainfall_mm} mm</span>
                  </div>
                )}
                {schedule.wind_speed_mps !== null && (
                  <div className="detail-item">
                    <span className="label">Wind Speed:</span>
                    <span className="value">{schedule.wind_speed_mps} m/s</span>
                  </div>
                )}
                {schedule.visibility_km !== null && (
                  <div className="detail-item">
                    <span className="label">Visibility:</span>
                    <span className="value">{schedule.visibility_km} km</span>
                  </div>
                )}
                {schedule.pressure_hpa !== null && (
                  <div className="detail-item">
                    <span className="label">Pressure:</span>
                    <span className="value">{schedule.pressure_hpa} hPa</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Road details */}
          {(schedule.surface_type || schedule.traffic_density || schedule.accident_count) && (
            <div className="detail-section">
              <h3>Road Details</h3>
              <div className="detail-grid">
                {schedule.surface_type && (
                  <div className="detail-item">
                    <span className="label">Surface Type:</span>
                    <span className="value">{schedule.surface_type}</span>
                  </div>
                )}
                {schedule.surface_condition && (
                  <div className="detail-item">
                    <span className="label">Surface Condition:</span>
                    <span className="value">{schedule.surface_condition}</span>
                  </div>
                )}
                {schedule.traffic_density && (
                  <div className="detail-item">
                    <span className="label">Traffic Density:</span>
                    <span className="value">{schedule.traffic_density}</span>
                  </div>
                )}
                {schedule.accident_count !== null && schedule.accident_count > 0 && (
                  <div className="detail-item">
                    <span className="label">Accidents:</span>
                    <span className="value">{schedule.accident_count}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Equipment details */}
          {(schedule.engine_temperature_c || schedule.fuel_level_percent || schedule.maintenance_status) && (
            <div className="detail-section">
              <h3>Equipment Details</h3>
              <div className="detail-grid">
                {schedule.engine_temperature_c !== null && (
                  <div className="detail-item">
                    <span className="label">Engine Temperature:</span>
                    <span className="value">{schedule.engine_temperature_c}°C</span>
                  </div>
                )}
                {schedule.fuel_level_percent !== null && (
                  <div className="detail-item">
                    <span className="label">Fuel Level:</span>
                    <span className="value">{schedule.fuel_level_percent}%</span>
                  </div>
                )}
                {schedule.engine_rpm !== null && (
                  <div className="detail-item">
                    <span className="label">Engine RPM:</span>
                    <span className="value">{schedule.engine_rpm}</span>
                  </div>
                )}
                {schedule.maintenance_status && (
                  <div className="detail-item">
                    <span className="label">Maintenance Status:</span>
                    <span className="value">{schedule.maintenance_status}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Vessel details */}
          {(schedule.delay_minutes || schedule.load_weight_tons || schedule.average_speed_knots) && (
            <div className="detail-section">
              <h3>Vessel Details</h3>
              <div className="detail-grid">
                {schedule.delay_minutes !== null && schedule.delay_minutes > 0 && (
                  <div className="detail-item">
                    <span className="label">Delay:</span>
                    <span className="value">{schedule.delay_minutes} minutes</span>
                  </div>
                )}
                {schedule.load_weight_tons !== null && (
                  <div className="detail-item">
                    <span className="label">Load Weight:</span>
                    <span className="value">{schedule.load_weight_tons} tons</span>
                  </div>
                )}
                {schedule.average_speed_knots !== null && (
                  <div className="detail-item">
                    <span className="label">Average Speed:</span>
                    <span className="value">{schedule.average_speed_knots} knots</span>
                  </div>
                )}
                {schedule.distance_traveled_km !== null && (
                  <div className="detail-item">
                    <span className="label">Distance Traveled:</span>
                    <span className="value">{schedule.distance_traveled_km} km</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .modal-content {
          background: ${COLORS.background};
          border-radius: 12px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid ${COLORS.border};
          position: sticky;
          top: 0;
          background: ${COLORS.background};
          z-index: 10;
        }
        
        .modal-header h2 {
          margin: 0;
          color: ${COLORS.text};
          font-size: 24px;
          font-weight: 700;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: ${COLORS.textLight};
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
        
        .close-btn:hover {
          background: ${COLORS.backgroundSecondary};
        }
        
        .modal-body {
          padding: 24px;
        }
        
        .detail-section {
          margin-bottom: 32px;
        }
        
        .detail-section:last-child {
          margin-bottom: 0;
        }
        
        .detail-section h3 {
          margin: 0 0 16px 0;
          color: ${COLORS.text};
          font-size: 18px;
          font-weight: 600;
          padding-bottom: 8px;
          border-bottom: 2px solid ${COLORS.primary}20;
        }
        
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .detail-item .label {
          font-size: 12px;
          color: ${COLORS.textLight};
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-item .value {
          font-size: 14px;
          color: ${COLORS.text};
          font-weight: 500;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          color: white;
          font-size: 12px;
          font-weight: 500;
          width: fit-content;
        }
        
        .notes-content {
          background: ${COLORS.backgroundSecondary};
          border: 1px solid ${COLORS.border};
          border-radius: 8px;
          padding: 16px;
          color: ${COLORS.text};
          line-height: 1.6;
          white-space: pre-wrap;
        }
        
        @media (max-width: 768px) {
          .modal-content {
            max-height: 95vh;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
          }
          
          .modal-header {
            padding: 16px;
          }
          
          .modal-body {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default ScheduleDetailModal;