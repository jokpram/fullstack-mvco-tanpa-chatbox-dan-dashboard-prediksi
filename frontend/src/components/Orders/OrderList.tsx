//OrderList.tsx
import React from 'react';
import { Order } from '@/types';
import OrderCard from './OrderCard';
import { COLORS } from '@/utils/constants';

interface OrderListProps {
  orders: Order[];
  onViewOrder?: (order: Order) => void;
  onEditOrder?: (order: Order) => void;
  onDeleteOrder?: (orderId: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
  isLoading = false,
  emptyMessage = 'No orders found'
}) => {
  if (isLoading) {
    return (
      <div className="order-list loading">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
        <style jsx>{`
          .order-list.loading {
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

  if (orders.length === 0) {
    return (
      <div className="order-list empty">
        <div className="empty-icon">📦</div>
        <h3>{emptyMessage}</h3>
        <p>Create your first order to get started</p>
        <style jsx>{`
          .order-list.empty {
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

  return (
    <div className="order-list">
      <div className="stats-bar">
        <span className="stat">
          Total: <strong>{orders.length}</strong>
        </span>
        <span className="stat">
          Created: <strong>{orders.filter(o => o.status === 'Created').length}</strong>
        </span>
        <span className="stat">
          Scheduled: <strong>{orders.filter(o => o.status === 'Scheduled').length}</strong>
        </span>
        <span className="stat">
          In Transit: <strong>{orders.filter(o => o.status === 'In Transit').length}</strong>
        </span>
      </div>
      
      <div className="orders-grid">
        {orders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            onView={onViewOrder}
            onEdit={onEditOrder}
            onDelete={onDeleteOrder}
          />
        ))}
      </div>

      <style jsx>{`
        .order-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .stats-bar {
          display: flex;
          gap: 16px;
          padding: 12px 16px;
          background: ${COLORS.backgroundSecondary};
          border-radius: 8px;
          border: 1px solid ${COLORS.border};
          flex-wrap: wrap;
        }
        
        .stat {
          font-size: 13px;
          color: ${COLORS.textLight};
        }
        
        .stat strong {
          color: ${COLORS.text};
          font-weight: 600;
        }
        
        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        
        @media (max-width: 768px) {
          .orders-grid {
            grid-template-columns: 1fr;
          }
          
          .stats-bar {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderList;