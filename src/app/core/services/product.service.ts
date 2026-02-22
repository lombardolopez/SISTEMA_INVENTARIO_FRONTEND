import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { Product, ProductFormData } from '../models/product.model';
import { MOCK_PRODUCTS } from '../data/mock-products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products = [...MOCK_PRODUCTS];

  getAll(): Observable<Product[]> {
    return of([...this.products]).pipe(delay(300));
  }

  getById(id: string): Observable<Product | undefined> {
    return of(this.products.find(p => p.id === id)).pipe(delay(200));
  }

  create(data: ProductFormData): Observable<Product> {
    const product: Product = {
      ...data,
      id: 'p-' + crypto.randomUUID().slice(0, 8),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.unshift(product);
    return of(product).pipe(delay(300));
  }

  update(id: string, data: Partial<ProductFormData>): Observable<Product> {
    const index = this.products.findIndex(p => p.id === id);
    this.products[index] = { ...this.products[index], ...data, updatedAt: new Date() };
    return of(this.products[index]).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    this.products = this.products.filter(p => p.id !== id);
    return of(undefined as void).pipe(delay(300));
  }

  getLowStock(): Observable<Product[]> {
    return of(this.products.filter(p => p.currentStock <= p.minimumStock)).pipe(delay(200));
  }

  search(term: string): Observable<Product[]> {
    const lower = term.toLowerCase();
    return of(this.products.filter(p =>
      p.name.toLowerCase().includes(lower) || p.sku.toLowerCase().includes(lower)
    )).pipe(delay(200));
  }
}
