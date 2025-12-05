//OrderCard.tsx
import React, { useState } from 'react';
import { Order } from '../../types';
import { formatDate, formatCurrency, getStatusColor, getTransportIcon } from '../../utils/helpers';
import { ORDER_STATUS, COLORS, ICONS } from '../../utils/constants';

interface OrderCardProps {
  order: Order;
  onView?: (order: Order) => void;
  onEdit?: (order: Order) => void;
  onDelete?: (orderId: string) => Promise<void>;
  isOwner?: boolean;
  // Tambahkan prop untuk role
  userRole?: 'mine_planner' | 'shipping_planner';
}

const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  onView, 
  onEdit, 
  onDelete, 
  isOwner = false,
  userRole = 'mine_planner' // default
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const statusColor = getStatusColor(order.status);
  const TransportIcon = getTransportIcon(order.transport_mode);

  const handleDelete = async () => {
    if (!onDelete) return;
    
    try {
      setIsDeleting(true);
      await onDelete(order.id);
      setShowConfirmDelete(false);
    } catch (error) {
      console.error('Failed to delete order:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="order-card">
      <div className="card-header">
        <div className="order-code">
          <span className="code">
            <ICONS.ORDER size={14} /> {order.order_code}
          </span>
          <span className="status" style={{ backgroundColor: statusColor }}>
            {order.status}
          </span>
        </div>
        <div className="order-date">
          <ICONS.SCHEDULE size={12} /> {formatDate(order.createdAt, 'dd/MM/yyyy')}
        </div>
      </div>

      <div className="card-content">
        <div className="route">
          <span className="origin">
            <ICONS.ACTIONS.LOCATION size={12} /> {order.origin}
          </span>
          <span className="arrow">
            <ICONS.ACTIONS.EXCHANGE size={12} />
          </span>
          <span className="destination">
            <ICONS.ACTIONS.LOCATION size={12} /> {order.destination}
          </span>
        </div>

        <div className="details-grid">
          <div className="detail">
            <span className="label">Cargo Type</span>
            <span className="value">{order.cargo_type}</span>
          </div>
          <div className="detail">
            <span className="label">
              <ICONS.ACTIONS.WEIGHT size={12} /> Weight
            </span>
            <span className="value">{order.cargo_weight_tons} tons</span>
          </div>
          <div className="detail">
            <span className="label">
              <TransportIcon size={12} /> Transport
            </span>
            <span className="value">{order.transport_mode}</span>
          </div>
          <div className="detail">
            <span className="label">
              <ICONS.FINANCE size={12} /> Estimated Cost
            </span>
            <span className="value">{formatCurrency(order.estimated_cost_usd || 0)}</span>
          </div>
        </div>

        {order.planned_departure && (
          <div className="departure">
            <span className="label">
              <ICONS.ACTIONS.TIME size={12} /> Planned Departure:
            </span>
            <span className="value">{formatDate(order.planned_departure)}</span>
          </div>
        )}

        {/* Tampilkan mine planner info untuk shipping planner */}
        {userRole === 'shipping_planner' && order.minePlanner && (
          <div className="mine-planner-info">
            <span className="label">
              <ICONS.MINE_PLANNER size={12} /> Created by:
            </span>
            <span className="value">{order.minePlanner.nama}</span>
          </div>
        )}

        {order.schedules && order.schedules.length > 0 && (
          <div className="schedules-count">
            <span className="label">
              <ICONS.SCHEDULE size={12} /> Schedules:
            </span>
            <span className="value">{order.schedules.length}</span>
          </div>
        )}
      </div>

      <div className="card-actions">
        {onView && (
          <button onClick={() => onView(order)} className="btn btn-view">
            <ICONS.ACTIONS.SEARCH size={12} /> View Details
          </button>
        )}
        
        {!showConfirmDelete ? (
          <>
            {/* Hanya tampilkan edit/delete untuk mine planner yang punya order */}
            {onEdit && order.status === ORDER_STATUS.CREATED && isOwner && userRole === 'mine_planner' && (
              <button onClick={() => onEdit(order)} className="btn btn-edit">
                <ICONS.ACTIONS.EDIT size={12} /> Edit
              </button>
            )}
            {onDelete && order.status === ORDER_STATUS.CREATED && isOwner && userRole === 'mine_planner' && (
              <button onClick={() => setShowConfirmDelete(true)} className="btn btn-delete">
                <ICONS.ACTIONS.DELETE size={12} /> Delete
              </button>
            )}
          </>
        ) : (
          <div className="confirm-delete">
            <span className="confirm-text">Delete this order?</span>
            <div className="confirm-actions">
              <button onClick={handleDelete} className="btn btn-confirm" disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <span className="spinner"></span>
                    Deleting...
                  </>
                ) : (
                  'Yes'
                )}
              </button>
              <button onClick={() => setShowConfirmDelete(false)} className="btn btn-cancel">
                No
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .order-card {
          background: ${COLORS.background};
          border: 1px solid ${COLORS.border};
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s;
        }
        
        .order-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        
        .order-code {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .code {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          color: ${COLORS.text};
          font-size: 16px;
        }
        
        .status {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          color: white;
          font-size: 12px;
          font-weight: 500;
          width: fit-content;
        }
        
        .order-date {
          display: flex;
          align-items: center;
          gap: 6px;
          color: ${COLORS.textLight};
          font-size: 12px;
        }
        
        .card-content {
          margin-bottom: 16px;
        }
        
        .route {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          padding: 8px;
          background: ${COLORS.backgroundSecondary};
          border-radius: 6px;
        }
        
        .origin, .destination {
          flex: 1;
          padding: 4px 8px;
          background: white;
          border-radius: 4px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .arrow {
          color: ${COLORS.primary};
          font-weight: 700;
          display: flex;
          align-items: center;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 12px;
        }
        
        .detail {
          display: flex;
          flex-direction: column;
        }
        
        .label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: ${COLORS.textLight};
          margin-bottom: 2px;
        }
        
        .value {
          font-size: 14px;
          color: ${COLORS.text};
          font-weight: 500;
        }
        
        .departure, .schedules-count, .mine-planner-info {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 13px;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid ${COLORS.border};
        }
        
        .departure .label, .schedules-count .label, .mine-planner-info .label {
          color: ${COLORS.textLight};
        }
        
        .departure .value, .schedules-count .value, .mine-planner-info .value {
          color: ${COLORS.text};
          font-weight: 500;
        }
        
        .card-actions {
          display: flex;
          gap: 8px;
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
          flex: 1;
        }
        
        .btn-view:hover {
          background: ${COLORS.primaryDark};
        }
        
        .btn-edit {
          background: transparent;
          border-color: ${COLORS.primary};
          color: ${COLORS.primary};
          flex: 1;
        }
        
        .btn-edit:hover {
          background: ${COLORS.primary};
          color: white;
        }
        
        .btn-delete {
          background: transparent;
          border-color: ${COLORS.error};
          color: ${COLORS.error};
          flex: 1;
        }
        
        .btn-delete:hover {
          background: ${COLORS.error};
          color: white;
        }
        
        .confirm-delete {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .confirm-text {
          font-size: 12px;
          color: ${COLORS.textLight};
          text-align: center;
        }
        
        .confirm-actions {
          display: flex;
          gap: 8px;
        }
        
        .btn-confirm {
          background: ${COLORS.error};
          color: white;
          flex: 1;
        }
        
        .btn-confirm:hover:not(:disabled) {
          background: #dc2626;
        }
        
        .btn-confirm:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .btn-cancel {
          background: transparent;
          border-color: ${COLORS.border};
          color: ${COLORS.textLight};
          flex: 1;
        }
        
        .btn-cancel:hover {
          background: ${COLORS.backgroundSecondary};
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

export default OrderCard;