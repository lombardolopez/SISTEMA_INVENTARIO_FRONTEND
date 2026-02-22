import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Category } from '../models/category.model';
import { MOCK_CATEGORIES } from '../data/mock-categories';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private categories = [...MOCK_CATEGORIES];

  getAll(): Observable<Category[]> {
    return of([...this.categories]).pipe(delay(300));
  }

  getById(id: string): Observable<Category | undefined> {
    return of(this.categories.find(c => c.id === id)).pipe(delay(200));
  }

  create(data: Omit<Category, 'id' | 'productCount'>): Observable<Category> {
    const category: Category = {
      ...data,
      id: 'cat-' + crypto.randomUUID().slice(0, 8),
      productCount: 0,
    };
    this.categories.push(category);
    return of(category).pipe(delay(300));
  }

  update(id: string, data: Partial<Category>): Observable<Category> {
    const index = this.categories.findIndex(c => c.id === id);
    this.categories[index] = { ...this.categories[index], ...data };
    return of(this.categories[index]).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    this.categories = this.categories.filter(c => c.id !== id);
    return of(undefined as void).pipe(delay(300));
  }
}
