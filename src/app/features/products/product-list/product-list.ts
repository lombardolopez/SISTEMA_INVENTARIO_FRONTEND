import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  protected Math = Math;

  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  selectedCategoryId = signal('');
  currentPage = signal(1);
  pageSize = 10;

  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.pageSize);
  });

  ngOnInit(): void {
    this.loading.set(true);
    this.productService.getAll().subscribe((paged) => {
      this.products.set(paged.content);
      this.filteredProducts.set(paged.content);
      this.loading.set(false);
    });
    this.categoryService.getAll().subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm.set(term);
    this.applyFilters();
  }

  onCategoryFilter(event: Event): void {
    const categoryId = (event.target as HTMLSelectElement).value;
    this.selectedCategoryId.set(categoryId);
    this.applyFilters();
  }

  private applyFilters(): void {
    let result = this.products();
    const term = this.searchTerm();
    const categoryId = this.selectedCategoryId();

    if (term) {
      result = result.filter(
        (p) => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term),
      );
    }

    if (categoryId) {
      result = result.filter((p) => p.categoryId === categoryId);
    }

    this.filteredProducts.set(result);
    this.currentPage.set(1);
  }

  getCategoryName(categoryId: string): string {
    const cat = this.categories().find((c) => c.id === categoryId);
    return cat ? cat.name : 'Unknown';
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(id).subscribe(() => {
        this.products.update((list) => list.filter((p) => p.id !== id));
        this.applyFilters();
      });
    }
  }

  navigateToCreate(): void {
    this.router.navigate(['/products/new']);
  }

  navigateToDetail(id: string): void {
    this.router.navigate(['/products', id]);
  }

  navigateToEdit(id: string): void {
    this.router.navigate(['/products', id, 'edit']);
  }
}
