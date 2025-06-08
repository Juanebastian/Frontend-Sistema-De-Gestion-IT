// header.component.ts
import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { AreaService } from '../../core/services/area.service';
import { Area } from '../../core/models/area.model';

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
  rolUsuario = signal<number>(0);
  nombreRol: string = '';
  areaUsuario = signal<number>(0);
  nombreArea: string = '';
  areas: Area[] = [];  

  constructor(private authService: AuthService
, private areaService: AreaService
  ) {}
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
      this.rolUsuario.set(user.rol_id);
      this.nombreRol = this.getNombreRol(user.rol_id);
      this.areaUsuario.set(user.area_id);

      // Primero carga las áreas, luego busca el nombre
      this.areaService.getAllAreas().subscribe({
        next: (data) => {
          this.areas = data;
          this.nombreArea = this.getNombreArea(user.area_id); // ahora sí puede buscar
        },
        error: (err) => {
          console.error('Error al cargar áreas:', err);
          this.nombreArea = 'Error al cargar área';
        }
      });
    }
  }


  cerrarSesion() {
    this.authService.logout(); // 👈 Aquí se ejecuta el cierre de sesión
  }

  getNombreRol(rolId: number): string {
    switch (rolId) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Técnico';
      case 3:
        return 'Colaborador';
      default:
        return 'Sin rol';
    }
  }

  getNombreArea(areaId: number): string {
    const area = this.areas.find(a => a.id === areaId);
    return area ? area.nombre : 'Sin área';
  }
  
}