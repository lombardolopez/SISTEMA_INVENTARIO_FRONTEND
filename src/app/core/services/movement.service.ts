import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Movement, MovementType, MovementReason } from '../models/movement.model';
import { ApiResponse, PagedResponse } from '../models/api.model';

@Injectable({ providedIn: 'root' })
export class MovementService {
  private readonly url = `${environment.apiUrl}/movements`;
  private http = inject(HttpClient);

  getAll(
    filters: {
      type?: MovementType;
      from?: string;
      to?: string;
      page?: number;
      size?: number;
    } = {},
  ): Observable<PagedResponse<Movement>> {
    let params = new HttpParams()
      .set('page', filters.page ?? 0)
      .set('size', filters.size ?? 10)
      .set('sort', 'createdAt,desc');

    if (filters.type) params = params.set('type', filters.type);
    if (filters.from) params = params.set('from', filters.from);
    if (filters.to) params = params.set('to', filters.to);

    return this.http
      .get<ApiResponse<PagedResponse<Movement>>>(this.url, { params })
      .pipe(map((res) => res.data));
  }

  getById(id: string): Observable<Movement> {
    return this.http.get<ApiResponse<Movement>>(`${this.url}/${id}`).pipe(map((res) => res.data));
  }

  getByProductId(productId: string, page = 0, size = 10): Observable<PagedResponse<Movement>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'createdAt,desc');
    return this.http
      .get<ApiResponse<PagedResponse<Movement>>>(`${this.url}/product/${productId}`, { params })
      .pipe(map((res) => res.data));
  }

  getRecent(limit: number): Observable<Movement[]> {
    return this.getAll({ size: limit }).pipe(map((paged) => paged.content));
  }

  create(data: {
    productId: string;
    type: MovementType;
    quantity: number;
    reason: MovementReason;
    notes?: string;
  }): Observable<Movement> {
    return this.http.post<ApiResponse<Movement>>(this.url, data).pipe(map((res) => res.data));
  }
}
