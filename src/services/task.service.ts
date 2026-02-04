import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, Task, CreateTaskData, TaskFilters } from '@/types/api';

export const taskService = {
  // Get all tasks with filters
  async getTasks(filters?: TaskFilters): Promise<PaginatedResponse<Task>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get<PaginatedResponse<Task>>(`/tasks?${params.toString()}`);
    return response.data;
  },

  // Get my tasks
  async getMyTasks(): Promise<Task[]> {
    const response = await api.get<ApiResponse<Task[]>>('/tasks/my');
    return response.data.data;
  },

  // Get single task
  async getTask(id: string): Promise<Task> {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data;
  },

  // Create task
  async createTask(data: CreateTaskData): Promise<Task> {
    const response = await api.post<ApiResponse<Task>>('/tasks', data);
    return response.data.data;
  },

  // Update task
  async updateTask(id: string, data: Partial<CreateTaskData & { status: Task['status'] }>): Promise<Task> {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data.data;
  },

  // Complete task
  async completeTask(id: string, notes?: string): Promise<Task> {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}/complete`, { notes });
    return response.data.data;
  },

  // Delete task (admin only)
  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};

export default taskService;
