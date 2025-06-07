import { Component } from '@angular/core';
import { TicketService } from '../../../../core/services/tickets.service';
import { AreaService } from '../../../../core/services/area.service';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Estado, Prioridad, Ticket } from '../../../../core/models/ticket.model';
import { Area } from '../../../../core/models/area.model';
import { Usuario } from '../../../../core/models/user.model';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-tecnicos-tickets',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './tecnicos-tickets.component.html',
  styleUrls: ['./tecnicos-tickets.component.css']
})
export class TecnicosTicketsComponent {
  tickets: Ticket[] = [];
  areas: Area[] = [];
  usuarios: Usuario[] = [];
  ticketsAbiertosCount: number = 0;

  estados: Estado[] = [
    { id: 1, nombre: 'Abierto' },
    { id: 2, nombre: 'En Proceso' },
    { id: 3, nombre: 'Cerrado' }
  ];

  prioridades: Prioridad[] = [
    { id: 1, nombre: 'Baja' },
    { id: 2, nombre: 'Media' },
    { id: 3, nombre: 'Alta' },
    { id: 4, nombre: 'Sin Asignar' }
  ];

  mostrarFormulario: boolean = false;
  modoAsignar: boolean = false;
  modoVer: boolean = false;

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
      estado_id: 1,
      prioridad_id: 4,
      area_id: 0,
      observaciones: '',
      id_creador: 1,
      id_tecnico: 1,
    };
  }

  cargarTickets(): void {
    this.cargando = true;
    this.error = '';
  
    const idTecnico = this.authService.getUserId();
  
    if (!idTecnico) {
      this.error = 'No se pudo obtener el ID del técnico.';
      this.cargando = false;
      return;
    }
  
    this.ticketService.getTicketsByTecnicoId(Number(idTecnico)).subscribe({
      next: (data) => {
        this.tickets = data;
        this.ticketsAbiertosCount = this.tickets.filter(t => t.estado_id === 2).length;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar tickets:', err);
        this.error = 'Error cargando tickets';
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
        alert('Error cargando áreas');
      }
    });
  }

  cargarUsuarios(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  abrirFormulario(): void {
    this.ticketForm = this.getTicketVacio();
    this.ticketForm.id_creador = Number(this.authService.getUserId() || 0);
    this.modoAsignar = false;
    this.modoVer = false;
    this.mostrarFormulario = true;
  }

  verTicket(ticket: Ticket): void {
    this.ticketForm = { ...ticket };
    this.modoVer = true;
    this.modoAsignar = false;
    this.mostrarFormulario = true;
  }

  activarAsignarDesdeVer(): void {
    this.ticketForm.estado_id = 2;
    this.modoVer = false;
    this.modoAsignar = true;
  }

  asignarTicket(ticket: Ticket): void {
    this.ticketForm = { ...ticket };
    this.ticketForm.estado_id = 2;
    this.modoAsignar = true;
    this.modoVer = false;
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.modoAsignar = false;
    this.modoVer = false;
  }

  guardarTicket(): void {
    if (this.modoVer) {
      this.cerrarFormulario();
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      alert('No se pudo obtener el usuario autenticado.');
      return;
    }

    this.ticketForm.id_creador = Number(userId);

    if (this.modoAsignar) {
      if (!this.ticketForm.id) {
        alert('El ticket no tiene ID para asignar.');
        return;
      }

      this.ticketService.updateTicket(this.ticketForm.id, this.ticketForm).subscribe({
        next: () => {
          alert('Ticket asignado con éxito');
          this.cargarTickets();
          this.cerrarFormulario();
        },
        error: (err) => {
          console.error('Error asignar ticket:', err);
          alert('Error al asignar ticket');
        }
      });
    } else {
      if (
        !this.ticketForm.asunto.trim() ||
        !this.ticketForm.descripcion.trim() ||
        this.ticketForm.area_id === 0
      ) {
        alert('Completa asunto, descripción y área.');
        return;
      }

      this.ticketService.createTicket(this.ticketForm).subscribe({
        next: () => {
          alert('Ticket registrado con éxito');
          this.cargarTickets();
          this.cerrarFormulario();
        },
        error: (err) => {
          console.error('Error registrando ticket:', err);
          alert('Error al registrar ticket');
        }
      });
    }
  }

  confirmarCerrarDesdeVer(): void {
    if (confirm('¿Seguro que deseas cerrar este ticket?')) {
      this.cerrarTicket(this.ticketForm);
    }
  }

  cerrarTicket(ticket: Ticket): void {
    // Actualizo los campos localmente para reflejar cierre
    ticket.estado_id = 3; // “Cerrado”
   

    // 1) EXTRAIGO LA OBSERVACIÓN que el usuario haya escrito en el modal
    const textoObs = ticket.observaciones || '';

    // 2) LLAMO AL SERVICIO enviando { observaciones: textoObs }:
    this.ticketService.cerrarTicket(ticket.id!, textoObs).subscribe({
      next: () => {
        alert('Ticket cerrado correctamente');
        this.cargarTickets();
        this.cerrarFormulario();
      },
      error: (err) => {
        console.error('Error al cerrar ticket:', err);
        alert('No se pudo cerrar el ticket');
        this.cargarTickets();
      }
    });
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
  get camposVer() {
    return [
      { label: 'Asunto', valor: this.ticketForm.asunto },
      { label: 'Descripción', valor: this.ticketForm.descripcion },
      { label: 'Área', valor: this.getNombreArea(this.ticketForm.area_id) },
      { label: 'Estado', valor: this.getNombreEstado(this.ticketForm.estado_id) },
      { label: 'Prioridad', valor: this.getNombrePrioridad(this.ticketForm.prioridad_id) },
      { label: 'Técnico Asignado', valor: this.getNombreUsuario(this.ticketForm.id_tecnico) },
      { label: 'Fecha Creación', valor: this.ticketForm.fecha_creacion },
      { label: 'Fecha Cierre', valor: this.ticketForm.fecha_cierre || '-' }
    ];
  }
}
