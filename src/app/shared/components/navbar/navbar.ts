import { Component, output, inject, signal, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  toggleSidebar = output<void>();

  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  currentUser = this.authService.getCurrentUser();
  alertCount = signal(0);
  showUserMenu = signal(false);

  ngOnInit(): void {
    this.alertService.getActiveCount().subscribe(count => this.alertCount.set(count));
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleUserMenu(): void {
    this.showUserMenu.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      admin: 'Admin',
      warehouse_manager: 'Warehouse Manager',
      viewer: 'Viewer',
    };
    return labels[role] || role;
  }
}
