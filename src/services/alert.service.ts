import api from '@/lib/axios';
import type { PaginatedResponse, Alert, CreateAlertData, AlertCounts } from '@/types/api';
import { extractData } from './apiAdapter';

const mapNotificationToAlert = (item: any): Alert => ({
  _id: item?._id,
  type: item?.type || 'system',
  severity: item?.priority === 'urgent'
    ? 'critical'
    : item?.priority === 'high'
      ? 'high'
      : item?.priority === 'medium'
        ? 'medium'
        : 'low',
  title: item?.title || 'Notification',
  message: item?.message || '',
  patient: item?.data?.entityType === 'patient' ? item?.data?.entityId : undefined,
  targetUsers: item?.recipient ? [item.recipient] : [],
  isRead: Boolean(item?.isRead),
  isAcknowledged: Boolean(item?.acknowledgedAt || item?.isRead),
  acknowledgedAt: item?.acknowledgedAt,
  isResolved: false,
  isDismissed: false,
  createdAt: item?.createdAt || new Date().toISOString(),
});

export const alertService = {
  // Get all alerts
  async getAlerts(filters?: { 
    severity?: string; 
    isResolved?: boolean; 
    page?: number; 
    limit?: number 
  }): Promise<PaginatedResponse<Alert>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    if (filters?.severity) {
      params.append('priority', filters.severity);
    }

    const response = await api.get(`/notifications?${params.toString()}`);
    const data = extractData<any>(response.data);
    const notifications = Array.isArray(data.notifications) ? data.notifications : [];
    const pagination = data.pagination || {};

    return {
      success: true,
      data: notifications.map(mapNotificationToAlert),
      pagination: {
        page: Number(pagination.page || 1),
        limit: Number(pagination.limit || notifications.length || 20),
        total: Number(pagination.total || notifications.length),
        pages: Number(pagination.pages || 1),
      },
    };
  },

  // Get my alerts
  async getMyAlerts(): Promise<Alert[]> {
    const response = await api.get('/notifications?limit=100');
    const data = extractData<any>(response.data);
    const notifications = Array.isArray(data.notifications) ? data.notifications : [];
    return notifications.map(mapNotificationToAlert);
  },

  // Get alert counts
  async getAlertCounts(): Promise<AlertCounts> {
    const response = await api.get('/notifications/stats');
    const stats = extractData<any>(response.data);
    const bySeverity: Record<string, number> = {
      critical: Number(stats.criticalCount || 0),
      medium: Number(stats.byType?.find?.((x: any) => x._id === 'alert')?.count || 0),
    };

    return {
      total: Number(stats.todayCount || 0),
      unread: Number(stats.unreadCount || 0),
      critical: Number(stats.criticalCount || 0),
      bySeverity,
    };
  },

  // Create alert
  async createAlert(data: CreateAlertData): Promise<Alert> {
    const response = await api.post('/notifications', {
      recipientId: data.targetUsers?.[0],
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.severity === 'critical' ? 'urgent' : data.severity,
      data: data.patient ? { entityType: 'patient', entityId: data.patient } : undefined,
    });
    return mapNotificationToAlert(extractData<any>(response.data, 'notification'));
  },

  // Acknowledge alert
  async acknowledgeAlert(id: string): Promise<Alert> {
    const response = await api.patch(`/notifications/${id}/acknowledge`);
    return mapNotificationToAlert(extractData<any>(response.data, 'notification'));
  },

  // Resolve alert
  async resolveAlert(id: string): Promise<Alert> {
    const response = await api.patch(`/notifications/${id}/read`);
    return mapNotificationToAlert(extractData<any>(response.data, 'notification'));
  },

  // Dismiss alert
  async dismissAlert(id: string): Promise<Alert> {
    const response = await api.delete(`/notifications/${id}`);
    return {
      _id: id,
      type: 'system',
      severity: 'low',
      title: 'Dismissed',
      message: 'Notification dismissed',
      targetUsers: [],
      isRead: true,
      isAcknowledged: true,
      isResolved: true,
      isDismissed: true,
      createdAt: new Date().toISOString(),
    };
  },
};

export default alertService;
