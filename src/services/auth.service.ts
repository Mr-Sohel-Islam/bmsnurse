import api, { setTokens, clearTokens } from '@/lib/axios';
import type { ApiResponse, LoginCredentials, LoginResponse, User, RegisterData } from '@/types/api';
import { extractData } from './apiAdapter';

const mapUser = (raw: any): User => {
  const firstName = raw?.firstName || '';
  const lastName = raw?.lastName || '';
  const name = raw?.name || `${firstName} ${lastName}`.trim();

  return {
    id: raw?.id || raw?._id,
    email: raw?.email,
    name,
    firstName: raw?.firstName,
    lastName: raw?.lastName,
    role: raw?.role,
    department: raw?.department,
    phone: raw?.phone,
    avatar: raw?.avatar,
    lastLogin: raw?.lastLogin,
  } as User;
};

export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<any>>('/auth/login', credentials);
    const payload = extractData<any>(response.data);
    const user = mapUser(payload.user || {});
    const token = payload.token as string;
    const refreshToken = payload.refreshToken as string | undefined;
    
    // Store tokens and user
    setTokens(token, refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data.data;
  },

  // Register new user (admin only)
  async register(data: RegisterData): Promise<User> {
    const name = data.name?.trim() || '';
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ') || '-';

    const response = await api.post<ApiResponse<any>>('/auth/register', {
      email: data.email,
      password: data.password,
      firstName,
      lastName,
      role: data.role,
      department: data.department,
      phone: data.phone,
    });
    return mapUser(extractData<any>(response.data, 'user'));
  },

  // Get current user
  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<any>>('/auth/me');
    return mapUser(extractData<any>(response.data, 'user'));
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    throw new Error('Refresh token is not supported by this backend');
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
