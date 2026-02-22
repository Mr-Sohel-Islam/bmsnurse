import api from '@/lib/axios';
import type { PaginatedResponse, Task, CreateTaskData, TaskFilters } from '@/types/api';
import { extractData, extractList, extractPaginated } from './apiAdapter';

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
    
    const response = await api.get(`/tasks?${params.toString()}`);
    return extractPaginated<Task>(response.data, 'tasks');
  },

  // Get my tasks
  async getMyTasks(): Promise<Task[]> {
    const response = await api.get('/tasks/my');
    return extractList<Task>(response.data, '');
  },

  // Get single task
  async getTask(id: string): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return extractData<Task>(response.data);
  },

  // Create task
  async createTask(data: CreateTaskData): Promise<Task> {
    const payload = {
      ...data,
      status: data.type === 'vitals' ? 'pending' : undefined,
    };
    const response = await api.post('/tasks', payload);
    return extractData<Task>(response.data);
  },

  // Update task
  async updateTask(id: string, data: Partial<CreateTaskData & { status: Task['status'] }>): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, data);
    return extractData<Task>(response.data);
  },

  // Complete task
  async completeTask(id: string, notes?: string): Promise<Task> {
    const response = await api.put(`/tasks/${id}/complete`, { notes });
    return extractData<Task>(response.data);
  },

  // Delete task (admin only)
  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};

export default taskService;
