import api from '@/lib/axios';
import type { PaginatedResponse, ActivityLog } from '@/types/api';

export const activityService = {
  // Get all activities
  async getActivities(filters?: {
    action?: string;
    user?: string;
    patient?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ActivityLog>> {
    // Unified activity endpoint is not available in the current backend.
    return {
      success: true,
      data: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 1 },
    };
  },

  // Get recent activities
  async getRecentActivities(limit?: number): Promise<ActivityLog[]> {
    return [];
  },

  // Get my activities
  async getMyActivities(): Promise<ActivityLog[]> {
    return [];
  },

  // Get patient activities
  async getPatientActivities(patientId: string): Promise<ActivityLog[]> {
    const response = await api.get(`/patients/${patientId}/history?limit=50`);
    const timeline = response?.data?.data?.timeline;
    if (!Array.isArray(timeline)) return [];
    return timeline.map((event: any) => ({
      _id: event.id,
      action: event.type,
      description: event.description || event.title,
      user: 'system',
      patient: patientId,
      metadata: event.metadata,
      createdAt: event.timestamp,
    }));
  },
};

export default activityService;
