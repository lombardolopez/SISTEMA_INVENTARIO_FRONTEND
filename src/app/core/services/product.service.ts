import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductFormData } from '../models/product.model';
import { ApiResponse, PagedResponse } from '../models/api.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly url = `${environment.apiUrl}/products`;
  private http = inject(HttpClient);

  getAll(
    filters: {
      search?: string;
      categoryId?: string;
      page?: number;
      size?: number;
    } = {},
  ): Observable<PagedResponse<Product>> {
    let params = new HttpParams()
      .set('page', filters.page ?? 0)
      .set('size', filters.size ?? 10)
      .set('sort', 'createdAt,desc');

    if (filters.search) params = params.set('search', filters.search);
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId);

    return this.http
      .get<ApiResponse<PagedResponse<Product>>>(this.url, { params })
      .pipe(map((res) => res.data));
  }

  getLowStock(): Observable<Product[]> {
    return this.http
      .get<ApiResponse<Product[]>>(`${this.url}/low-stock`)
      .pipe(map((res) => res.data));
  }

  getById(id: string): Observable<Product> {
    return this.http.get<ApiResponse<Product>>(`${this.url}/${id}`).pipe(map((res) => res.data));
  }

  create(data: ProductFormData): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(this.url, data).pipe(map((res) => res.data));
  }

  update(id: string, data: ProductFormData): Observable<Product> {
    return this.http
      .put<ApiResponse<Product>>(`${this.url}/${id}`, data)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<ApiResponse<null>>(`${this.url}/${id}`).pipe(map(() => void 0));
  }

  search(term: string): Observable<PagedResponse<Product>> {
    return this.getAll({ search: term });
  }
}
