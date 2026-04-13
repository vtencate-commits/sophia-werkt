import type { CreateUserRequest, UpdateUserRequest, UserRole } from '@sophia-werkt/shared';
import { prisma } from '../config/database';
import { hashPassword } from '../utils/hash';
import { AppError } from '../utils/errors';

export class UserService {
  async getUserById(userId: string): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    return user;
  }

  async updateUser(userId: string, data: UpdateUserRequest): Promise<any> {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
      },
    });
  }

  async getAllUsers(limit: number = 50, offset: number = 0): Promise<any[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async createUser(data: CreateUserRequest): Promise<any> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Email already in use', 409, 'EMAIL_EXISTS');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });

    return user;
  }

  async changeUserRole(userId: string, role: UserRole): Promise<any> {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }

  async deactivateUser(userId: string): Promise<any> {
    return prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        isActive: true,
      },
    });
  }

  async activateUser(userId: string): Promise<any> {
    return prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
      select: {
        id: true,
        email: true,
        isActive: true,
      },
    });
  }

  async createTimeEntry(caseId: string, userId: string, data: any): Promise<any> {
    return prisma.timeEntry.create({
      data: {
        caseId,
        userId,
        date: new Date(data.date),
        durationMinutes: data.durationMinutes,
        description: data.description,
        activityType: data.activityType,
        billable: data.billable ?? true,
      },
    });
  }

  async updateTimeEntry(timeEntryId: string, data: any): Promise<any> {
    return prisma.timeEntry.update({
      where: { id: timeEntryId },
      data,
    });
  }

  async getTimeEntries(caseId: string): Promise<any[]> {
    return prisma.timeEntry.findMany({
      where: { caseId },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async deleteTimeEntry(timeEntryId: string): Promise<void> {
    await prisma.timeEntry.delete({
      where: { id: timeEntryId },
    });
  }
}
