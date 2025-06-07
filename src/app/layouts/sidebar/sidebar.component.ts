// sidebar.component.ts

import { Component, Input, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TicketService } from '../../core/services/tickets.service';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  path: string;
  icon: string;            // aquí guardaremos la ruta SVG
  label: string;
  children?: NavItem[];
  exact?: boolean;
  requiredRole?: number;   // 1 = administrador, 2 = técnico
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  // Sólo guardamos los contadores (nunca la lista completa).
  ticketsAbiertosCount = signal<number>(0);
  ticketsEnProcesoByTecCount = signal<number>(0);

  // Estado de carga / error para el badge
  cargandoCount = signal<boolean>(false);
  errorCount = signal<string>('');

  // Rol del usuario (1=administrador, 2=técnico)
  rolUsuario = signal<number>(0);

  constructor(
    private ticketService: TicketService,
    private authService: AuthService
  ) {}

  private router = inject(Router);

  @Input() collapsed = false;

  // Control de submenús “abiertos”
  readonly expandedMenus = signal<Set<string>>(new Set());
  readonly hoveredItem = signal<string | null>(null);
  readonly shouldShowTooltip = computed(() => this.collapsed);

  // —————— Aquí hemos corregido los `icon` con las rutas Heroicons correctas ——————
  readonly navItems: NavItem[] = [
    // ––––––– Administrador –––––––––
    {
      path: '/administrador/home',
      icon: 'M2.25 12l8.954-7.049c.266-.209.64-.209.906 0L20.954 12M4.5 9.75v8.25c0 .414.336.75.75.75H9.75a.75.75 0 00.75-.75V15a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v3.75c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75V9.75M9.75 9.75V4.5h4.5v5.25',
      label: 'Dashboard',
      exact: true,
      requiredRole: 1
    },
    {
      path: '/administrador/areas',
      icon: 'M3.375 3.375h17.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125H3.375A1.125 1.125 0 012.25 20.25V4.5c0-.621.504-1.125 1.125-1.125zm4.5 3.375v13.5m4.5-13.5v13.5m4.5-13.5v13.5',
      label: 'Áreas',
      requiredRole: 1
    },
    {
      path: '/administrador/users',
      icon: 'M2.25 21.75c0-3.018 2.448-5.467 5.467-5.467h4.566c3.019 0 5.468 2.449 5.468 5.467m-15.5-5.467a5.468 5.468 0 1110.936 0m-10.936 0v.75m10.936-.75v.75M12 10.5a4.125 4.125 0 100-8.25 4.125 4.125 0 000 8.25zm0 0v1.125m0 7.875v1.875',
      label: 'Usuarios',
      requiredRole: 1,
      children: [
        {
          path: '/administrador/listar-usuarios',
          icon: 'M4.5 5.25h15m-15 6h15m-15 6h15',
          label: 'Lista de usuarios'
        },
        {
          path: '/administrador/roles',
          icon: 'M12 11.25c1.794 0 3.75-.75 4.5-2.25m0 0a6.959 6.959 0 00-9 0m9 0c.495.747.495 1.764 0 2.511M6 16.5c0-1.125.576-2.25 1.5-2.813m0 0a5.97 5.97 0 014.5 0m0 0C12.924 13.25 13.5 14.375 13.5 15.5',
          label: 'Roles y permisos'
        }
      ]
    },
    {
      path: '/administrador/computadores',
      icon: 'M9.75 3.375H6.75A2.25 2.25 0 004.5 5.625v12.75a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25V5.625a2.25 2.25 0 00-2.25-2.25h-3m0 0v-.75a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v.75z',
      label: 'Equipos',
      requiredRole: 1,
      children: [
        {
          path: '/administrador/computadores',
          icon: 'M3 7.5h18M3 10.5h18M3 13.5h18M3 16.5h18',
          label: 'Todos los equipos'
        },
        {
          path: '/administrador/marcas',
          icon: 'M7.5 7.5h.75M7.5 3.75h3.75c.64 0 1.28.256 1.789.766l4.5 4.5a2.25 2.25 0 010 3.182l-4.5 4.5a2.25 2.25 0 01-3.182 0l-4.5-4.5A2.25 2.25 0 013 8.25V7.5a3.75 3.75 0 013.75-3.75z',
          label: 'Marcas'
        },
        {
          path: '/administrador/sistemas-operativos',
          icon: 'M12 3.75v16.5m6.75-7.125h-13.5',
          label: 'Sistemas Operativos'
        },
        {
          path: '/administrador/modelos',
          icon: 'M9 6.75H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H12m0-3.75a2.25 2.25 0 012.25 2.25M9 6.75a2.25 2.25 0 012.25-2.25m0 0h1.5a2.25 2.25 0 012.25 2.25',
          label: 'Modelos'
        }
      ]
    },
    {
      path: '/administrador/tickets',
      icon: 'M12 8.25a.75.75 0 01.75.75v2.25h2.25a.75.75 0 010 1.5h-2.25v2.25a.75.75 0 01-1.5 0v-2.25H8.25a.75.75 0 010-1.5h2.25V9a.75.75 0 01.75-.75z',
      label: 'Mesa De Ayuda',
      requiredRole: 1
    },

    // ––––––– Técnico –––––––––
    {
      path: '/tecnicos/home',
      icon: 'M2.25 21.75c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125H3.375c-.621 0-1.125-.504-1.125-1.125v-.75zm0 0v-8.25A2.25 2.25 0 014.5 11.25h15a2.25 2.25 0 012.25 2.25v8.25',
      label: 'Dashboard',
      exact: true,
      requiredRole: 2
    },
    {
      path: '/tecnicos/tickets',
      icon: 'M3 5.25h18M3 8.25h18M3 11.25h18M3 14.25h18',
      label: 'Mesa De Ayuda',
      requiredRole: 2
    },

    // ––––––– Todos –––––––––
    {
      path: '/reports',
      icon: 'M3 3l18 18M3 21h18M3 13.5h18M3 4.5h18',
      label: 'Reportes'
    },
    {
      path: '/settings',
      icon: 'M12 6.75a5.25 5.25 0 015.25 5.25 5.25 5.25 0 01-5.25 5.25A5.25 5.25 0 016.75 12 5.25 5.25 0 0112 6.75m0 0v1.5m0 8.25v1.5m5.25-4.5h1.5M4.5 12h1.5m3.53-5.53l1.06 1.06m4.5 4.5l1.06 1.06m0-4.5l-1.06 1.06M8.53 16.47l-1.06 1.06',
      label: 'Configuración'
    }
  ];

  // Filtra ítems según el rol actual
  readonly filteredNavItems = computed(() => {
    return this.navItems.filter(item => {
      if (!item.requiredRole) return true;
      return item.requiredRole === this.rolUsuario();
    });
  });

  ngOnInit(): void {
    // 1) Leer rol del token
    const user = this.authService.getUserInfo();
    if (user && user.rol_id) {
      this.rolUsuario.set(Number(user.rol_id));
    }

    // 2) Sólo llamar a la función que corresponda (para no hacer llamadas innecesarias)
    if (this.rolUsuario() === 1) {
      this.cargarCountAdministradores();
    } else if (this.rolUsuario() === 2) {
      this.cargarCountTecnico();
    }
  }

  private cargarCountAdministradores() {
    this.cargandoCount.set(true);
    this.errorCount.set('');
    this.ticketService.getAllTickets().subscribe({
      next: all => {
        // Contar “abiertos” (estado_id === 1)
        const abiertos = all.filter(t => t.estado_id === 1).length;
        this.ticketsAbiertosCount.set(abiertos);
        this.cargandoCount.set(false);
      },
      error: err => {
        console.error('Error al cargar tickets para administrador:', err);
        this.errorCount.set('Error al cargar tickets');
        this.cargandoCount.set(false);
      }
    });
  }

  private cargarCountTecnico() {
    this.cargandoCount.set(true);
    this.errorCount.set('');
    const idTec = Number(this.authService.getUserId());
    if (!idTec) {
      this.errorCount.set('No se obtuvo ID del técnico');
      this.cargandoCount.set(false);
      return;
    }
    this.ticketService.getTicketsByTecnicoId(idTec).subscribe({
      next: byTec => {
        // Ejemplo: contar “en proceso” (estado_id === 2)
        const enProceso = byTec.filter(t => t.estado_id === 2).length;
        this.ticketsEnProcesoByTecCount.set(enProceso);
        this.cargandoCount.set(false);
      },
      error: err => {
        console.error('Error al cargar tickets para técnico:', err);
        this.errorCount.set('Error al cargar tickets técnico');
        this.cargandoCount.set(false);
      }
    });
  }

  // Métodos auxiliares (submenús, hover, active, etc.)
  toggleSubmenu(path: string) {
    const expanded = this.expandedMenus();
    const clone = new Set(expanded);
    if (clone.has(path)) clone.delete(path);
    else clone.add(path);
    this.expandedMenus.set(clone);
  }

  isSubmenuExpanded(path: string): boolean {
    return this.expandedMenus().has(path);
  }

  onItemHover(path: string | null) {
    this.hoveredItem.set(path);
  }

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }

  hasActiveChild(item: NavItem): boolean {
    if (!item.children) return false;
    return item.children.some(c => this.isActive(c.path));
  }

  trackByPath(_: number, item: NavItem) {
    return item.path;
  }
}
