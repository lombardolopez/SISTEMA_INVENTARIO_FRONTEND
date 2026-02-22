import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { Movement } from '../../../core/models/movement.model';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { MovementService } from '../../../core/services/movement.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private movementService = inject(MovementService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  product = signal<Product | null>(null);
  category = signal<Category | null>(null);
  movements = signal<Movement[]>([]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getById(id).subscribe(p => {
        if (p) {
          this.product.set(p);
          this.categoryService.getById(p.categoryId).subscribe(c => this.category.set(c ?? null));
        }
      });
      this.movementService.getByProductId(id).subscribe(m => this.movements.set(m));
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  editProduct(): void {
    const p = this.product();
    if (p) this.router.navigate(['/products', p.id, 'edit']);
  }

  deleteProduct(): void {
    const p = this.product();
    if (p && confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(p.id).subscribe(() => this.router.navigate(['/products']));
    }
  }
}
