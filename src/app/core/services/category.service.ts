import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../models/category.model';
import { ApiResponse } from '../models/api.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly url = `${environment.apiUrl}/categories`;
  private http = inject(HttpClient);

  getAll(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(this.url).pipe(map((res) => res.data));
  }

  getById(id: string): Observable<Category> {
    return this.http.get<ApiResponse<Category>>(`${this.url}/${id}`).pipe(map((res) => res.data));
  }

  create(data: { name: string; description: string; color: string }): Observable<Category> {
    return this.http.post<ApiResponse<Category>>(this.url, data).pipe(map((res) => res.data));
  }

  update(
    id: string,
    data: { name: string; description: string; color: string },
  ): Observable<Category> {
    return this.http
      .put<ApiResponse<Category>>(`${this.url}/${id}`, data)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<ApiResponse<null>>(`${this.url}/${id}`).pipe(map(() => void 0));
  }
}
