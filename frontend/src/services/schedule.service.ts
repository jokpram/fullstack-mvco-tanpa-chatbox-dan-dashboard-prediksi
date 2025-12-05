// services/schedule.service.ts - UPDATE
import api from './api';
import { Schedule, ScheduleFormData, UpdateScheduleData } from '@/types';

export const scheduleService = {
  async createSchedule(data: ScheduleFormData): Promise<{ schedule: Schedule }> {
    const response = await api.post('/schedules', data);
    return response.data;
  },

  async updateSchedule(scheduleId: string, data: UpdateScheduleData): Promise<{ schedule: Schedule }> {
    const response = await api.put(`/schedules/${scheduleId}`, data);
    return response.data;
  },

  async getSchedules(): Promise<{ schedules: Schedule[] }> {
    const response = await api.get('/schedules');
    return response.data;
  },

  // TAMBAHKAN: Fungsi untuk mendapatkan detail schedule
  async getScheduleDetail(scheduleId: string): Promise<{ schedule: Schedule }> {
    const response = await api.get(`/schedules/${scheduleId}`);
    return response.data;
  },

  // TAMBAHKAN: Fungsi untuk mendapatkan schedules berdasarkan orderId
  async getSchedulesByOrderId(orderId: string): Promise<{ schedules: Schedule[] }> {
    const response = await api.get(`/schedules/order/${orderId}`);
    return response.data;
  }
};