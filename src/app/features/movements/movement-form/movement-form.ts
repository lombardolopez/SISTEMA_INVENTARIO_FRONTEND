import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { MovementService } from '../../../core/services/movement.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-movement-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './movement-form.html',
  styleUrl: './movement-form.css',
})
export class MovementForm implements OnInit {
  private productService = inject(ProductService);
  private movementService = inject(MovementService);
  private authService = inject(AuthService);
  private router = inject(Router);

  products = signal<Product[]>([]);
  loading = signal(false);

  form = new FormGroup({
    type: new FormControl<'entry' | 'exit'>('entry', Validators.required),
    productId: new FormControl('', Validators.required),
    quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
    reason: new FormControl('', Validators.required),
    notes: new FormControl(''),
  });

  reasonOptions = [
    { value: 'purchase', label: 'Purchase' },
    { value: 'production', label: 'Production' },
    { value: 'sale', label: 'Sale' },
    { value: 'adjustment', label: 'Adjustment' },
    { value: 'return', label: 'Return' },
  ];

  ngOnInit(): void {
    this.productService.getAll().subscribe(p => this.products.set(p));
  }

  setType(type: 'entry' | 'exit'): void {
    this.form.get('type')?.setValue(type);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    const val = this.form.getRawValue();
    const product = this.products().find(p => p.id === val.productId);

    this.movementService.create({
      productId: val.productId!,
      productName: product?.name ?? '',
      type: val.type!,
      quantity: val.quantity!,
      reason: val.reason! as any,
      notes: val.notes ?? '',
      performedBy: this.authService.getCurrentUser()()?.name ?? 'Unknown',
    }).subscribe(() => this.router.navigate(['/movements']));
  }

  cancel(): void {
    this.router.navigate(['/movements']);
  }
}
