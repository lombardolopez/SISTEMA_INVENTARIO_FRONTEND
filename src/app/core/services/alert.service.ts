import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StockAlert, AlertSeverity } from '../models/alert.model';
import { ApiResponse } from '../models/api.model';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly url = `${environment.apiUrl}/alerts`;
  private http = inject(HttpClient);

  getAll(
    filters: { acknowledged?: boolean; severity?: AlertSeverity } = {},
  ): Observable<StockAlert[]> {
    let params = new HttpParams();
    if (filters.acknowledged !== undefined)
      params = params.set('acknowledged', filters.acknowledged);
    if (filters.severity) params = params.set('severity', filters.severity);

    return this.http
      .get<ApiResponse<StockAlert[]>>(this.url, { params })
      .pipe(map((res) => res.data));
  }

  getActive(): Observable<StockAlert[]> {
    return this.getAll({ acknowledged: false });
  }

  getActiveCount(): Observable<number> {
    return this.getActive().pipe(map((alerts) => alerts.length));
  }

  acknowledge(id: string): Observable<StockAlert> {
    return this.http
      .patch<ApiResponse<StockAlert>>(`${this.url}/${id}/acknowledge`, {})
      .pipe(map((res) => res.data));
  }

  generateAlerts(): Observable<void> {
    return this.http.post<ApiResponse<null>>(`${this.url}/generate`, {}).pipe(map(() => void 0));
  }
}
