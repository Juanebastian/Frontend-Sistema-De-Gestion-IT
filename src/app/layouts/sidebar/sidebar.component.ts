// sidebar.component.ts
import { Component, Input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

// Interfaz para definir la estructura de los ítems del menú
interface NavItem {
  path: string;
  icon: string;
  label: string;
  badge?: number;
  children?: NavItem[];
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  // Inyección manual del Router para navegar y obtener la URL actual
  private router = inject(Router);
  
  // Permite controlar si el sidebar está colapsado o expandido
  @Input() collapsed = false;
  
  // Signals para estado reactivo
  readonly expandedMenus = signal<Set<string>>(new Set());

  // Signal que indica qué ítem está siendo "hovered"
  readonly hoveredItem = signal<string | null>(null);
  
  // Definición del listado de ítems del sidebar con rutas, íconos y etiquetas
  readonly navItems: NavItem[] = [
    {
      path: '/administrador/home',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0 0h4m0 0h3a1 1 0 001-1V10M9 21h6',
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/administrador/areas',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      label: 'Areas',
      badge: 3
    },
    {
      path: '/administrador/users',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      label: 'Usuarios',
      children: [
        { path: '/administrador/listar-usuarios', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', label: 'Lista de usuarios' },
        { path: '/administrador/listar-usuarios', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Roles y permisos' }
      ]
    },
    {
      path: '/administrador/computadores',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      label: 'Equipos',
      children: [
        { path: '/administrador/computadores', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', label: 'Todos los equipos' },
        { path: '/administrador/marcas', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', label: 'Marcas' },
        { path: '/administrador/sistemas-operativos', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', label: 'Sistemas Operativos' },
        { path: '/administrador/modelos', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Modelos' }
      ]
    },
    {
      path: '/administrador/tickets',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      label: 'Mesa De Ayuda',
      badge: 12
    },
    {
      path: '/reports',
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      label: 'Reportes'
    },
    {
      path: '/settings',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      label: 'Configuración'
    }
  ];

  // Muestra tooltip solo si el sidebar está colapsado
  readonly shouldShowTooltip = computed(() => this.collapsed);

  // Alterna (abre o cierra) un submenú según si ya estaba abierto
  toggleSubmenu(itemPath: string): void {
    const expanded = this.expandedMenus();// Estado actual
    const newExpanded = new Set(expanded);// Copia mutable
    
    if (newExpanded.has(itemPath)) {
      newExpanded.delete(itemPath);// Si ya está abierto, ciérralo
    } else {
      newExpanded.add(itemPath);// Si está cerrado, ábrelo
    }
    
    this.expandedMenus.set(newExpanded);// Actualiza el estado reactivo
  }

  // Verifica si un submenú específico está expandido
  isSubmenuExpanded(itemPath: string): boolean {
    return this.expandedMenus().has(itemPath);
  }

  // Cambia el ítem actualmente en "hover"
  onItemHover(itemPath: string | null): void {
    this.hoveredItem.set(itemPath);
  }

  // Verifica si la ruta actual del navegador coincide con el ítem del menú
  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }

  // Verifica si alguno de los hijos del ítem está activo
  hasActiveChild(item: NavItem): boolean {
    if (!item.children) return false;
    return item.children.some(child => this.isActive(child.path));
  }

   // Función para optimizar el rendimiento en ngFor
  trackByPath(index: number, item: NavItem): string {
    return item.path;
  }
}