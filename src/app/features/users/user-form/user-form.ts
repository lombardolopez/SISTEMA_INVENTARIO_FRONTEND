import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = signal(false);
  loading = signal(false);
  userId = '';

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('viewer', Validators.required),
    isActive: new FormControl(true),
  });

  roleOptions = [
    { value: 'admin', label: 'Admin', desc: 'Full access to all features' },
    { value: 'warehouse_manager', label: 'Warehouse Manager', desc: 'Manage products, movements and alerts' },
    { value: 'viewer', label: 'Viewer', desc: 'Read-only access to inventory data' },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.userId = id;
      this.userService.getById(id).subscribe(u => {
        if (u) {
          this.form.patchValue({ name: u.name, email: u.email, role: u.role, isActive: u.isActive });
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
      this.userService.update(this.userId, data).subscribe(() => this.router.navigate(['/users']));
    } else {
      this.userService.create(data).subscribe(() => this.router.navigate(['/users']));
    }
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }
}
