import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { MOCK_PRODUCTS } from '../data/mock-products';
import { MOCK_MOVEMENTS } from '../data/mock-movements';
import { MOCK_CATEGORIES } from '../data/mock-categories';

export interface DashboardStats {
  totalProducts: number;
  lowStockItems: number;
  movementsThisMonth: number;
  totalStockValue: number;
}

export interface CategoryStock {
  name: string;
  color: string;
  totalStock: number;
}

export interface DailyMovements {
  date: string;
  entries: number;
  exits: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {

  getStats(): Observable<DashboardStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const stats: DashboardStats = {
      totalProducts: MOCK_PRODUCTS.length,
      lowStockItems: MOCK_PRODUCTS.filter(p => p.currentStock <= p.minimumStock).length,
      movementsThisMonth: MOCK_MOVEMENTS.filter(m => m.createdAt >= startOfMonth).length,
      totalStockValue: MOCK_PRODUCTS.reduce((sum, p) => sum + p.currentStock * p.unitPrice, 0),
    };
    return of(stats).pipe(delay(300));
  }

  getStockByCategory(): Observable<CategoryStock[]> {
    const data = MOCK_CATEGORIES.map(cat => ({
      name: cat.name,
      color: cat.color,
      totalStock: MOCK_PRODUCTS
        .filter(p => p.categoryId === cat.id)
        .reduce((sum, p) => sum + p.currentStock, 0),
    }));
    return of(data).pipe(delay(300));
  }

  getMovementsByDay(days: number): Observable<DailyMovements[]> {
    const result: DailyMovements[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 86400000);
      const dayMovements = MOCK_MOVEMENTS.filter(m => m.createdAt >= dayStart && m.createdAt < dayEnd);
      result.push({
        date: dateStr,
        entries: dayMovements.filter(m => m.type === 'entry').reduce((s, m) => s + m.quantity, 0),
        exits: dayMovements.filter(m => m.type === 'exit').reduce((s, m) => s + m.quantity, 0),
      });
    }
    return of(result).pipe(delay(300));
  }
}
