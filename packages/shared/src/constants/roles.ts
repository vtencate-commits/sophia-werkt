import type { UserRole } from '../types/auth.types';

export const ROLE_LABELS: Record<UserRole, string> = {
  CLIENT: 'Client',
  LAWYER: 'Advocaat',
  ADMIN: 'Beheerder',
};

export const ROLES: UserRole[] = ['CLIENT', 'LAWYER', 'ADMIN'];
