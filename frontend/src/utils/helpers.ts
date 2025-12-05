//helpers.ts
import { format, parseISO } from 'date-fns';
import { COLORS, ICONS, getTransportIcon, getWeatherIcon, getRoadIcon } from './constants';
import { IconType } from 'react-icons';

export const formatDate = (date: string | Date, formatStr: string = 'PPpp'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch {
    return 'Invalid Date';
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'Created': '#3b82f6',
    'Scheduled': '#8b5cf6',
    'In Transit': '#f59e0b',
    'Completed': '#10b981',
    'Cancelled': '#ef4444',
    'Planned': '#3b82f6',
    'Ongoing': '#f59e0b',
    'Delayed': '#f97316',
    'Good': '#10b981',
    'Moderate': '#f59e0b',
    'Bad': '#ef4444',
    'Clear': '#3b82f6',
    'Rainy': '#60a5fa',
    'Storm': '#ef4444',
    'Foggy': '#9ca3af',
    'Snowy': '#93c5fd'
  };
  return colors[status] || '#6b7280';
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const generateOrderCode = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Re-export icon getters
export { getTransportIcon, getWeatherIcon, getRoadIcon };