import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, Role } from '../models/user.model';
import { ApiResponse, PagedResponse } from '../models/api.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly url = `${environment.apiUrl}/users`;
  private http = inject(HttpClient);

  getAll(page = 0, size = 10): Observable<PagedResponse<User>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'createdAt,desc');
    return this.http
      .get<ApiResponse<PagedResponse<User>>>(this.url, { params })
      .pipe(map((res) => res.data));
  }

  getById(id: string): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.url}/${id}`).pipe(map((res) => res.data));
  }

  create(data: { name: string; email: string; password: string; role: Role }): Observable<User> {
    return this.http.post<ApiResponse<User>>(this.url, data).pipe(map((res) => res.data));
  }

  update(
    id: string,
    data: { name: string; email: string; password?: string; role: Role },
  ): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.url}/${id}`, data).pipe(map((res) => res.data));
  }

  toggleActive(id: string): Observable<User> {
    return this.http
      .patch<ApiResponse<User>>(`${this.url}/${id}/toggle-active`, {})
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<ApiResponse<null>>(`${this.url}/${id}`).pipe(map(() => void 0));
  }
}
