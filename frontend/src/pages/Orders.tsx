//Orders.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { orderService } from '@/services/order.service';
import OrderForm from '@/components/Orders/OrderForm';
import OrderCard from '@/components/Orders/OrderCard';
import OrderDetailModal from '@/components/Orders/OrderDetailModal';
import { Order, OrderFormData } from '@/types';
import { COLORS } from '@/utils/constants';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      let response;
      
      // PERBAIKAN: Load orders berdasarkan role
      if (user?.role === 'mine_planner') {
        response = await orderService.getMyOrders();
      } else if (user?.role === 'shipping_planner') {
        response = await orderService.getAllOrders();
      } else {
        return;
      }
      
      setOrders(response.orders || []);
    } catch (err: any) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrder = async (data: OrderFormData) => {
    try {
      setIsCreating(true);
      await orderService.createOrder(data);
      await loadOrders();
      setShowForm(false);
      setSuccessMessage('Order created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order');
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await orderService.deleteOrder(orderId);
      await loadOrders();
      setSuccessMessage('Order deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete order');
      throw err;
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  return (
    <div className="orders-page">
      <div className="page-header">
        <div>
          <h1>{user?.role === 'shipping_planner' ? 'All Orders' : 'My Orders'}</h1>
          <p>
            {user?.role === 'shipping_planner' 
              ? 'View all orders from mine planners' 
              : 'Manage and track your mining orders'}
          </p>
        </div>
        
        {/* Hanya mine planner yang bisa create order */}
        {user?.role === 'mine_planner' && (
          <button
            className="create-btn"
            onClick={() => setShowForm(!showForm)}
            disabled={isCreating}
          >
            {showForm ? 'Cancel' : '+ Create Order'}
          </button>
        )}
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

      {showForm && user?.role === 'mine_planner' && (
        <div className="form-section">
          <h2>Create New Order</h2>
          <OrderForm onSubmit={handleCreateOrder} isLoading={isCreating} />
        </div>
      )}

      <div className="orders-section">
        <h2>
          {user?.role === 'shipping_planner' ? 'All Orders' : 'Your Orders'} 
          <span className="count-badge">{orders.length}</span>
        </h2>
        
        {isLoading ? (
          <div className="loading">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No orders found</h3>
            <p>
              {user?.role === 'mine_planner' 
                ? 'Create your first order to get started' 
                : 'No orders available from mine planners'}
            </p>
            {user?.role === 'mine_planner' && (
              <button
                className="create-btn"
                onClick={() => setShowForm(true)}
              >
                + Create Order
              </button>
            )}
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onView={handleViewOrder}
                onDelete={user?.role === 'mine_planner' ? handleDeleteOrder : undefined}
                isOwner={user?.id === order.minePlannerId}
              />
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={showOrderDetail}
          onClose={() => {
            setShowOrderDetail(false);
            setSelectedOrder(null);
          }}
        />
      )}

      <style jsx>{`
        .orders-page {
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
        
        .error-alert button,
        .success-alert button {
          margin-left: auto;
          background: none;
          border: none;
          color: inherit;
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
        
        .orders-section h2 {
          margin: 0 0 20px 0;
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
          background: ${COLORS.background};
          border: 1px solid ${COLORS.border};
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
        
        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        @media (max-width: 768px) {
          .orders-page {
            padding: 16px;
          }
          
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          
          .orders-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Orders;