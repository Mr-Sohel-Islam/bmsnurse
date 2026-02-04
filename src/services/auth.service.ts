import api, { setTokens, clearTokens } from '@/lib/axios';
import type { ApiResponse, LoginCredentials, LoginResponse, User, RegisterData } from '@/types/api';

export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    const { user, token, refreshToken } = response.data.data;
    
    // Store tokens and user
    setTokens(token, refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data.data;
  },

  // Register new user (admin only)
  async register(data: RegisterData): Promise<User> {
    const response = await api.post<ApiResponse<User>>('/auth/register', data);
    return response.data.data;
  },

  // Get current user
  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const response = await api.post<ApiResponse<{ token: string; refreshToken: string }>>('/auth/refresh', {
      refreshToken,
    });
    const { token, refreshToken: newRefreshToken } = response.data.data;
    setTokens(token, newRefreshToken);
    return response.data.data;
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      clearTokens();
    }
  },

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/auth/password', { currentPassword, newPassword });
  },

  // Get stored user
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};

export default authService;
