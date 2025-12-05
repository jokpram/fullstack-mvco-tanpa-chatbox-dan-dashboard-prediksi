// components/Orders/OrderDetailModal.tsx - UPDATE
import React, { useState, useEffect } from 'react';
import { Order } from '@/types';
import { formatDate, formatCurrency, getStatusColor } from '@/utils/helpers';
import { scheduleService } from '@/services/schedule.service';
import { COLORS, ICONS } from '@/utils/constants';

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, isOpen, onClose }) => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  useEffect(() => {
    if (order && isOpen) {
      loadSchedules();
    }
  }, [order, isOpen]);

  const loadSchedules = async () => {
    if (!order) return;
    
    try {
      setLoadingSchedules(true);
      const response = await scheduleService.getSchedulesByOrderId(order.id);
      setSchedules(response.schedules || []);
    } catch (error) {
      console.error('Failed to load schedules:', error);
    } finally {
      setLoadingSchedules(false);
    }
  };

  if (!order || !isOpen) return null;

  const statusColor = getStatusColor(order.status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Order Details</h2>
          <button className="close-btn" onClick={onClose}>
            <ICONS.CLOSE size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="detail-section">
            <h3>Basic Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Order Code:</span>
                <span className="value">{order.order_code}</span>
              </div>
              <div className="detail-item">
                <span className="label">Status:</span>
                <span className="status-badge" style={{ backgroundColor: statusColor }}>
                  {order.status}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Created:</span>
                <span className="value">{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Route Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Origin:</span>
                <span className="value">{order.origin}</span>
              </div>
              <div className="detail-item">
                <span className="label">Destination:</span>
                <span className="value">{order.destination}</span>
              </div>
              <div className="detail-item">
                <span className="label">Distance:</span>
                <span className="value">{order.distance_km ? `${order.distance_km} km` : 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Cargo Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Cargo Type:</span>
                <span className="value">{order.cargo_type}</span>
              </div>
              <div className="detail-item">
                <span className="label">Weight:</span>
                <span className="value">{order.cargo_weight_tons} tons</span>
              </div>
              <div className="detail-item">
                <span className="label">Transport Mode:</span>
                <span className="value">{order.transport_mode}</span>
              </div>
            </div>
          </div>

          {order.planned_departure && (
            <div className="detail-section">
              <h3>Timing</h3>
              <div className="detail-item">
                <span className="label">Planned Departure:</span>
                <span className="value">{formatDate(order.planned_departure)}</span>
              </div>
            </div>
          )}

          {order.estimated_cost_usd && (
            <div className="detail-section">
              <h3>Financial Information</h3>
              <div className="detail-item">
                <span className="label">Estimated Cost:</span>
                <span className="value">{formatCurrency(order.estimated_cost_usd)}</span>
              </div>
            </div>
          )}

          {/* TAMBAHKAN: Section untuk Schedules */}
          <div className="detail-section">
            <div className="section-header-with-button">
              <h3>Schedules ({loadingSchedules ? '...' : schedules.length})</h3>
              <button 
                onClick={loadSchedules} 
                className="refresh-btn"
                disabled={loadingSchedules}
              >
                {loadingSchedules ? (
                  <>
                    <span className="spinner"></span>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <ICONS.ACTIONS.SEARCH size={12} />
                    Refresh
                  </>
                )}
              </button>
            </div>
            
            {loadingSchedules ? (
              <div className="loading-schedules">
                <span className="spinner"></span>
                Loading schedules...
              </div>
            ) : schedules.length === 0 ? (
              <div className="empty-schedules">
                <ICONS.SCHEDULE size={24} />
                <p>No schedules found for this order</p>
              </div>
            ) : (
              <div className="schedules-list">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="schedule-item">
                    <div className="schedule-header">
                      <div className="schedule-id">
                        <ICONS.SCHEDULE size={12} />
                        Schedule ID: {schedule.id.slice(0, 8)}...
                      </div>
                      <span className="schedule-status" style={{ 
                        backgroundColor: getStatusColor(schedule.status) 
                      }}>
                        {schedule.status}
                      </span>
                    </div>
                    <div className="schedule-details">
                      {schedule.departure_time && (
                        <span className="detail">
                          <ICONS.ACTIONS.TIME size={12} />
                          Departure: {formatDate(schedule.departure_time)}
                        </span>
                      )}
                      {schedule.arrival_time && (
                        <span className="detail">
                          <ICONS.ACTIONS.TIME size={12} />
                          Arrival: {formatDate(schedule.arrival_time)}
                        </span>
                      )}
                      {schedule.vehicle_id && (
                        <span className="detail">
                          <ICONS.TRANSPORT.TRUCK size={12} />
                          Vehicle: {schedule.vehicle_id}
                        </span>
                      )}
                      {schedule.vessel_name && (
                        <span className="detail">
                          <ICONS.TRANSPORT.SHIP size={12} />
                          Vessel: {schedule.vessel_name}
                        </span>
                      )}
                    </div>
                    {schedule.shippingPlanner && (
                      <div className="schedule-planner">
                        <span className="label">
                          <ICONS.SHIPPING_PLANNER size={12} />
                          Planned by:
                        </span>
                        <span className="value">{schedule.shippingPlanner.nama}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional attributes for logistics */}
          {(order.origin_location || order.destination_location || order.travel_time_hr || order.co2_emission_kg) && (
            <div className="detail-section">
              <h3>Logistics Information</h3>
              <div className="detail-grid">
                {order.origin_location && (
                  <div className="detail-item">
                    <span className="label">Origin Location:</span>
                    <span className="value">{order.origin_location}</span>
                  </div>
                )}
                {order.destination_location && (
                  <div className="detail-item">
                    <span className="label">Destination Location:</span>
                    <span className="value">{order.destination_location}</span>
                  </div>
                )}
                {order.travel_time_hr && (
                  <div className="detail-item">
                    <span className="label">Travel Time:</span>
                    <span className="value">{order.travel_time_hr} hours</span>
                  </div>
                )}
                {order.co2_emission_kg && (
                  <div className="detail-item">
                    <span className="label">CO2 Emission:</span>
                    <span className="value">{order.co2_emission_kg} kg</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional attributes for production */}
          {(order.production_tons || order.fuel_consumed_liters || order.downtime_minutes) && (
            <div className="detail-section">
              <h3>Production Information</h3>
              <div className="detail-grid">
                {order.production_tons && (
                  <div className="detail-item">
                    <span className="label">Production:</span>
                    <span className="value">{order.production_tons} tons</span>
                  </div>
                )}
                {order.fuel_consumed_liters && (
                  <div className="detail-item">
                    <span className="label">Fuel Consumed:</span>
                    <span className="value">{order.fuel_consumed_liters} liters</span>
                  </div>
                )}
                {order.downtime_minutes && (
                  <div className="detail-item">
                    <span className="label">Downtime:</span>
                    <span className="value">{order.downtime_minutes} minutes</span>
                  </div>
                )}
                {order.equipment_efficiency_percent && (
                  <div className="detail-item">
                    <span className="label">Equipment Efficiency:</span>
                    <span className="value">{order.equipment_efficiency_percent}%</span>
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
        
        .section-header-with-button {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: ${COLORS.backgroundSecondary};
          border: 1px solid ${COLORS.border};
          border-radius: 6px;
          font-size: 12px;
          color: ${COLORS.textLight};
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
        
        .spinner {
          width: 12px;
          height: 12px;
          border: 2px solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
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
        
        .schedules-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .schedule-item {
          border: 1px solid ${COLORS.border};
          border-radius: 8px;
          padding: 16px;
          background: ${COLORS.backgroundSecondary};
        }
        
        .schedule-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .schedule-id {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          color: ${COLORS.text};
          font-size: 14px;
        }
        
        .schedule-status {
          padding: 4px 12px;
          border-radius: 12px;
          color: white;
          font-size: 11px;
          font-weight: 500;
        }
        
        .schedule-details {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 13px;
          color: ${COLORS.textLight};
          margin-bottom: 8px;
        }
        
        .schedule-details .detail {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .schedule-planner {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: ${COLORS.textLight};
          padding-top: 8px;
          border-top: 1px solid ${COLORS.border};
        }
        
        .schedule-planner .label {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .schedule-planner .value {
          font-weight: 500;
          color: ${COLORS.text};
        }
        
        .loading-schedules {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          justify-content: center;
          color: ${COLORS.textLight};
        }
        
        .empty-schedules {
          text-align: center;
          padding: 40px;
          color: ${COLORS.textLight};
        }
        
        .empty-schedules svg {
          margin-bottom: 12px;
          opacity: 0.5;
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
          
          .schedule-details {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderDetailModal;