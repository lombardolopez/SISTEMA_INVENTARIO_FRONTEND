import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.model';

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  lowStockCount: number;
  criticalStockCount: number;
  totalMovementsToday: number;
  totalEntriesToday: number;
  totalExitsToday: number;
  pendingAlertsCount: number;
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
  private readonly url = `${environment.apiUrl}/dashboard`;
  private http = inject(HttpClient);

  getStats(): Observable<DashboardStats> {
    return this.http
      .get<ApiResponse<DashboardStats>>(`${this.url}/stats`)
      .pipe(map((res) => res.data));
  }

  getStockByCategory(): Observable<CategoryStock[]> {
    return this.http
      .get<ApiResponse<CategoryStock[]>>(`${this.url}/stock-by-category`)
      .pipe(map((res) => res.data));
  }

  getMovementsByDay(days: number): Observable<DailyMovements[]> {
    const params = new HttpParams().set('days', days);
    return this.http
      .get<ApiResponse<DailyMovements[]>>(`${this.url}/movements-by-day`, { params })
      .pipe(map((res) => res.data));
  }
}
