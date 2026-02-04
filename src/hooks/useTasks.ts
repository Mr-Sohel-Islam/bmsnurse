import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/task.service';
import type { TaskFilters, CreateTaskData, Task } from '@/types/api';
import { toast } from 'sonner';

// Get all tasks
export const useTasks = (filters?: TaskFilters) => {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskService.getTasks(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get my tasks
export const useMyTasks = () => {
  return useQuery({
    queryKey: ['tasks', 'my'],
    queryFn: () => taskService.getMyTasks(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get single task
export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => taskService.getTask(id),
    enabled: !!id,
  });
};

// Create task mutation
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskData) => taskService.createTask(data),
    onSuccess: (task) => {
      toast.success(`Task "${task.title}" created successfully`);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create task');
    },
  });
};

// Update task mutation
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTaskData & { status: Task['status'] }> }) =>
      taskService.updateTask(id, data),
    onSuccess: (task) => {
      toast.success(`Task updated successfully`);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update task');
    },
  });
};

// Complete task mutation
export const useCompleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => taskService.completeTask(id, notes),
    onSuccess: () => {
      toast.success('Task completed successfully');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to complete task');
    },
  });
};

// Delete task mutation
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      toast.success('Task deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete task');
    },
  });
};
