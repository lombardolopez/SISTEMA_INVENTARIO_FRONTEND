import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList implements OnInit {
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loading.set(true);
    this.categoryService.getAll().subscribe(c => {
      this.categories.set(c);
      this.loading.set(false);
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/categories/new']);
  }

  navigateToEdit(id: string): void {
    this.router.navigate(['/categories', id, 'edit']);
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.delete(id).subscribe(() => {
        this.categories.update(list => list.filter(c => c.id !== id));
      });
    }
  }
}
