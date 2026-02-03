import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

// Date formatting
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return '-';
  
  return format(parsed, 'MMM d, yyyy');
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return '-';
  
  return format(parsed, 'MMM d, yyyy h:mm a');
};

export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return '-';
  
  return formatDistanceToNow(parsed, { addSuffix: true });
};

// Currency formatting
export const formatCurrency = (amount: number | string | null | undefined, currency = 'EUR'): string => {
  if (amount === null || amount === undefined) return '€0.00';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '€0.00';
  
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency,
  }).format(numAmount);
};

// Status helpers
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    active: 'var(--green)',
    completed: 'var(--green)',
    processing: 'var(--blue)',
    pending: 'var(--gold-start)',
    'on-hold': 'var(--gold-start)',
    cancelled: '#ef4444',
    failed: '#ef4444',
    refunded: '#9ca3af',
  };
  
  return statusColors[status.toLowerCase()] || 'var(--text-muted)';
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    active: 'Active',
    completed: 'Completed',
    processing: 'Processing',
    pending: 'Pending',
    'on-hold': 'On Hold',
    cancelled: 'Cancelled',
    failed: 'Failed',
    refunded: 'Refunded',
  };
  
  return labels[status.toLowerCase()] || status;
};

// Text helpers
export const truncate = (text: string, length: number): string => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

export const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const getInitials = (firstName?: string, lastName?: string): string => {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return first + last || '?';
};

// Number helpers
export const formatNumber = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined) return '0';
  
  const parsed = typeof num === 'string' ? parseInt(num, 10) : num;
  if (isNaN(parsed)) return '0';
  
  return new Intl.NumberFormat('nl-NL').format(parsed);
};

export const formatCompactNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Validation helpers
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Debounce
export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
