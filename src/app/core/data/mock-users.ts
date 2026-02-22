import { User } from '../models/user.model';

const d = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000);

export const MOCK_USERS: User[] = [
  { id: 'u-1', name: 'Carlos Mendez', email: 'carlos@carpentry.com', role: 'admin', isActive: true, createdAt: d(365) },
  { id: 'u-2', name: 'Maria Lopez', email: 'maria@carpentry.com', role: 'warehouse_manager', isActive: true, createdAt: d(300) },
  { id: 'u-3', name: 'Ana Rivera', email: 'ana@carpentry.com', role: 'warehouse_manager', isActive: true, createdAt: d(200) },
  { id: 'u-4', name: 'Jorge Ramirez', email: 'jorge@carpentry.com', role: 'viewer', isActive: true, createdAt: d(150) },
  { id: 'u-5', name: 'Laura Chen', email: 'laura@carpentry.com', role: 'viewer', isActive: false, createdAt: d(100) },
];
