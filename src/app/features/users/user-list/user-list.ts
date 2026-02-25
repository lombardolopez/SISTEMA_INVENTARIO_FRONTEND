import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  users = signal<User[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loading.set(true);
    this.userService.getAll().subscribe((paged) => {
      this.users.set(paged.content);
      this.loading.set(false);
    });
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      admin: 'Admin',
      warehouse_manager: 'Manager',
      viewer: 'Viewer',
    };
    return labels[role] || role;
  }

  navigateToCreate(): void {
    this.router.navigate(['/users/new']);
  }

  navigateToEdit(id: string): void {
    this.router.navigate(['/users', id, 'edit']);
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.delete(id).subscribe(() => {
        this.users.update((list) => list.filter((u) => u.id !== id));
      });
    }
  }
}
