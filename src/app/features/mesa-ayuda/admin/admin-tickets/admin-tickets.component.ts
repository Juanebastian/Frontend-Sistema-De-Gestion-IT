import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { AreaService } from '../../../../core/services/area.service';
import { TicketService } from '../../../../core/services/tickets.service';
import { UserService } from '../../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

interface Area {
  id: number;
  nombre: string;
}

interface Ticket {
  id?: number;
  asunto: string;
  descripcion: string;
  estado_id: number;
  prioridad_id: number;
  id_creador: number;
  id_tecnico: number;
  area_id: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  fecha_cierre?: string | null;
}

interface Estado {
  id: number;
  nombre: string;
}

interface Prioridad {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-admin-tickets',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin-tickets.component.html',
  styleUrls: ['./admin-tickets.component.css']
})
export class AdminTicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  areas: Area[] = [];
  usuarios: any[] = [];
  tecnicos: any[] = [];

  estados: Estado[] = [
    { id: 1, nombre: 'Pendiente' },
    { id: 2, nombre: 'En Proceso' },
    { id: 3, nombre: 'Resuelto' }
  ];

  prioridades: Prioridad[] = [
    { id: 1, nombre: 'Baja' },
    { id: 2, nombre: 'Media' },
    { id: 3, nombre: 'Alta' }
  ];

  mostrarFormulario: boolean = false;
  esEdicion: boolean = false;
  ticketForm: Ticket = this.getTicketVacio();

  cargando: boolean = false;
  error: string = '';

  constructor(
    private ticketService: TicketService,
    private areaService: AreaService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarTickets();
    this.cargarAreas();
    this.cargarUsuarios();
  }

  private getTicketVacio(): Ticket {
    return {
      asunto: '',
      descripcion: '',
      estado_id: 0,
      prioridad_id: 0,
      area_id: 0,
      id_creador: 1,
      id_tecnico: 1,
    };
  }

  cargarTickets(): void {
    this.cargando = true;
    this.error = '';
    this.ticketService.getAllTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar tickets:', err);
        this.error = '❌ Error cargando tickets';
        this.cargando = false;
      }
    });
  }

  cargarAreas(): void {
    this.areaService.getAllAreas().subscribe({
      next: (data) => {
        this.areas = data;
      },
      error: (err) => {
        console.error('Error al cargar áreas:', err);
        alert('❌ Error cargando áreas');
      }
    });
  }

  cargarUsuarios(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.usuarios = data;
        // Suponiendo que técnicos son usuarios con rol técnico, aquí filtramos
        this.tecnicos = this.usuarios.filter(u => u.rol === 'tecnico' || u.isTecnico);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  abrirFormulario(): void {
    this.ticketForm = this.getTicketVacio();
    this.esEdicion = false;
    this.mostrarFormulario = true;
  }

  editarTicket(ticket: Ticket): void {
    this.ticketForm = { ...ticket };
    this.esEdicion = true;
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
  }

  guardarTicket(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      alert('❌ No se pudo obtener el usuario autenticado.');
      return;
    }

    this.ticketForm.id_creador = Number(userId);

    if (this.esEdicion) {
      if (!this.ticketForm.id) {
        alert('❌ El ticket no tiene ID para actualizar.');
        return;
      }
      this.ticketService.updateTicket(this.ticketForm.id, this.ticketForm).subscribe({
        next: () => {
          alert('✅ Ticket actualizado con éxito');
          this.cargarTickets();
          this.cerrarFormulario();
        },
        error: (err) => {
          console.error('Error actualizando ticket:', err);
          alert('❌ Error al actualizar ticket');
        }
      });
    } else {
      this.ticketService.createTicket(this.ticketForm).subscribe({
        next: () => {
          alert('✅ Ticket registrado con éxito');
          this.cargarTickets();
          this.cerrarFormulario();
        },
        error: (err) => {
          console.error('Error registrando ticket:', err);
          alert('❌ Error al registrar ticket');
        }
      });
    }
  }

  getNombreUsuario(id: number): string {
    const usuario = this.usuarios.find(u => u.id === id);
    return usuario ? usuario.nombre : 'Desconocido';
  }

  getNombreEstado(id: number): string {
    const estado = this.estados.find(e => e.id === id);
    return estado ? estado.nombre : 'Desconocido';
  }

  getNombrePrioridad(id: number): string {
    const prioridad = this.prioridades.find(p => p.id === id);
    return prioridad ? prioridad.nombre : 'Desconocida';
  }

  getNombreArea(id: number): string {
    const area = this.areas.find(a => a.id === id);
    return area ? area.nombre : 'Sin área';
  }
}
