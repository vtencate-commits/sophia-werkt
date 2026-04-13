import type { UserRole } from './auth.types';

export interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  twoFactorEnabled: boolean;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive?: boolean;
  role?: UserRole;
}

export interface TimeEntryInfo {
  id: string;
  caseId: string;
  userId: string;
  userName: string;
  date: string;
  durationMinutes: number;
  description: string;
  activityType: string;
  billable: boolean;
  createdAt: string;
}

export interface CreateTimeEntryRequest {
  date: string;
  durationMinutes: number;
  description: string;
  activityType: string;
  billable?: boolean;
}
