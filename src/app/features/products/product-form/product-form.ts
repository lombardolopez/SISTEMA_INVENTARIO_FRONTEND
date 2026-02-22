import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  categories = signal<Category[]>([]);
  isEditMode = signal(false);
  loading = signal(false);
  productId = '';

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    categoryId: new FormControl('', Validators.required),
    sku: new FormControl('', Validators.required),
    unit: new FormControl('piece', Validators.required),
    currentStock: new FormControl(0, [Validators.required, Validators.min(0)]),
    minimumStock: new FormControl(0, [Validators.required, Validators.min(0)]),
    unitPrice: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    location: new FormControl(''),
  });

  unitOptions = [
    { value: 'piece', label: 'Piece' },
    { value: 'board', label: 'Board' },
    { value: 'sheet', label: 'Sheet' },
    { value: 'kg', label: 'Kilogram' },
    { value: 'liter', label: 'Liter' },
    { value: 'meter', label: 'Meter' },
    { value: 'box', label: 'Box' },
  ];

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(c => this.categories.set(c));
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId = id;
      this.loading.set(true);
      this.productService.getById(id).subscribe(p => {
        if (p) {
          this.form.patchValue({
            name: p.name,
            description: p.description,
            categoryId: p.categoryId,
            sku: p.sku,
            unit: p.unit,
            currentStock: p.currentStock,
            minimumStock: p.minimumStock,
            unitPrice: p.unitPrice,
            location: p.location,
          });
        }
        this.loading.set(false);
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    const data = this.form.getRawValue() as any;

    if (this.isEditMode()) {
      this.productService.update(this.productId, data).subscribe(() => {
        this.router.navigate(['/products']);
      });
    } else {
      this.productService.create(data).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}
