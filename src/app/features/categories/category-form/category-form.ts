import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm implements OnInit {
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = signal(false);
  loading = signal(false);
  categoryId = '';

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    color: new FormControl('#6366f1'),
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.categoryId = id;
      this.categoryService.getById(id).subscribe(c => {
        if (c) {
          this.form.patchValue({ name: c.name, description: c.description, color: c.color });
        }
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
      this.categoryService.update(this.categoryId, data).subscribe(() => this.router.navigate(['/categories']));
    } else {
      this.categoryService.create(data).subscribe(() => this.router.navigate(['/categories']));
    }
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }
}
