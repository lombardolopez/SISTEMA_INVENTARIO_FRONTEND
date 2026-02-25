import { Component, OnInit, inject, signal } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-low-stock-list',
  standalone: true,
  imports: [],
  templateUrl: './low-stock-list.html',
  styleUrl: './low-stock-list.css',
})
export class LowStockList implements OnInit {
  private productService = inject(ProductService);
  products = signal<Product[]>([]);
  protected Math = Math;

  ngOnInit(): void {
    this.productService.getLowStock().subscribe((p) => this.products.set(p));
  }
}
