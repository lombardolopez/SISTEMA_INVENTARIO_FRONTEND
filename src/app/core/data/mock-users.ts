import { User } from '../models/user.model';

const d = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString();

export const MOCK_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Carlos Mendez',
    email: 'carlos@carpentry.com',
    role: 'admin',
    isActive: true,
    createdAt: d(365),
    updatedAt: d(30),
  },
  {
    id: 'u-2',
    name: 'Maria Lopez',
    email: 'maria@carpentry.com',
    role: 'warehouse_manager',
    isActive: true,
    createdAt: d(300),
    updatedAt: d(15),
  },
  {
    id: 'u-3',
    name: 'Ana Rivera',
    email: 'ana@carpentry.com',
    role: 'warehouse_manager',
    isActive: true,
    createdAt: d(200),
    updatedAt: d(20),
  },
  {
    id: 'u-4',
    name: 'Jorge Ramirez',
    email: 'jorge@carpentry.com',
    role: 'viewer',
    isActive: true,
    createdAt: d(150),
    updatedAt: d(45),
  },
  {
    id: 'u-5',
    name: 'Laura Chen',
    email: 'laura@carpentry.com',
    role: 'viewer',
    isActive: false,
    createdAt: d(100),
    updatedAt: d(10),
  },
];
