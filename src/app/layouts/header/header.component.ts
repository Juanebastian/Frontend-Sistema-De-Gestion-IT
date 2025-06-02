// header.component.ts
import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  nombreUsuario: string = 'Nombre de Usuario'; 
  correoUsuario: string = 'Correo de Usuario'; 

  constructor(private authService: AuthService) {}
  // Signals para estado reactivo
  readonly isSearchExpanded = signal(false);
  readonly notificationCount = signal(3);
  readonly userMenuOpen = signal(false);

  toggle(): void {
    this.toggleSidebar.emit();
  }

  toggleSearch(): void {
    this.isSearchExpanded.update(value => !value);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update(value => !value);
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    console.log('Searching for:', target.value);
    // Implementar lógica de búsqueda
  }

  onNotificationClick(): void {
    console.log('Opening notifications');
    // Implementar lógica de notificaciones
  }

  onProfileClick(): void {
    console.log('Opening profile');
    // Implementar navegación al perfil
  }

  

  ngOnInit(): void {
    const user = this.authService.getUserInfo();
    if (user && user.nombre) {
      this.nombreUsuario = user.nombre;
      this.correoUsuario = user.correo;
    }
  }
  cerrarSesion() {
    this.authService.logout(); // 👈 Aquí se ejecuta el cierre de sesión
  }
}