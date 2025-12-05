//order.service.ts
import api from './api';
import { Order, OrderFormData } from '@/types';

export const orderService = {
  async createOrder(data: OrderFormData): Promise<{ order: Order }> {
    const response = await api.post('/orders', data);
    return response.data;
  },

  async getMyOrders(): Promise<{ orders: Order[] }> {
    const response = await api.get('/orders/mine');
    return response.data;
  },

  async getOrderById(orderId: string): Promise<{ order: Order }> {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  async getAllOrders(): Promise<{ orders: Order[] }> {
    const response = await api.get('/orders');
    return response.data;
  },

  async deleteOrder(orderId: string): Promise<{ message: string }> {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  }
};