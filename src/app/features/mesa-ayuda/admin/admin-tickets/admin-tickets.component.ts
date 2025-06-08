import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { AreaService } from '../../../../core/services/area.service';
import { TicketService } from '../../../../core/services/tickets.service';
import { UserService } from '../../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Ticket, Estado, Prioridad } from '../../../../core/models/ticket.model';
import { Area } from '../../../../core/models/area.model';
import { Usuario } from '../../../../core/models/user.model';

@Component({
  selector: 'app-admin-tickets',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin-tickets.component.html',
  styleUrls: ['./admin-tickets.component.css']
})
export class AdminTicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  areas: Area[] = [];
  usuarios: Usuario[] = [];
  ticketsAbiertosCount: number = 0;
  ticketsEnProcesoCount: number = 0;
  ticketsCerradosCount: number = 0;

  ticketsFiltrados: Ticket[] = [];
  filtroTexto: string = '';
  paginaActual: number = 1;
  itemsPorPagina: number = 5;
  ticketsFiltradosTotales: Ticket[] = [];

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
  modoVer: boolean = false;               // Bandera para controlar “Ver”
  ticketForm: Ticket = this.getTicketVacio();

  cargando: boolean = false;
  error: string = '';

  constructor(
    private ticketService: TicketService,
    private areaService: AreaService,
    private userService: UserService,
    private authService: AuthService
  ) { }

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
    this.ticketService.getAllTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.aplicarFiltroYPaginacion();
        this.ticketsAbiertosCount = this.tickets.filter(t => t.estado_id === 1).length;
        this.ticketsEnProcesoCount = this.tickets.filter(t => t.estado_id === 2).length;
        this.ticketsCerradosCount = this.tickets.filter(t => t.estado_id === 3).length;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar tickets:', err);
        this.error = ' Error cargando tickets';
        this.cargando = false;
      }
    });
  }



  // Método para filtrar y paginar la lista



  aplicarFiltroYPaginacion(): void {
    const texto = this.filtroTexto.toLowerCase();

    // Filtramos
    const filtrados = this.tickets.filter(ticket => {
      const datos = [
        ticket.id?.toString(),
        ticket.asunto,
        ticket.descripcion,
        this.getNombreEstado(ticket.estado_id),
        this.getNombrePrioridad(ticket.prioridad_id),
        this.getNombreUsuario(ticket.id_creador),
        this.getNombreUsuario(ticket.id_tecnico),
        this.getNombreArea(ticket.area_id),
        ticket.observaciones,
        ticket.fecha_creacion ? new Date(ticket.fecha_creacion).toLocaleString() : '',
        ticket.fecha_cierre ? new Date(ticket.fecha_cierre).toLocaleString() : ''
      ]
        .filter(campo => campo !== undefined && campo !== null)
        .map(campo => campo!.toString().toLowerCase())
        .join(' ');

      return datos.includes(texto);
    });



    // Guardamos los totales filtrados
    this.ticketsFiltradosTotales = filtrados;

    // Aplicamos paginación
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.ticketsFiltrados = filtrados.slice(inicio, fin);
  }




  // Método para manejar cambio de página
  cambiarPagina(nuevaPagina: number) {
    this.paginaActual = nuevaPagina;
    this.aplicarFiltroYPaginacion();
  }

  // Método para cuando cambia el filtro
  onFiltroChange() {
    this.paginaActual = 1;  // resetear a la página 1 al cambiar filtro
    this.aplicarFiltroYPaginacion();
  }

  get totalPaginas(): number {
    return Math.ceil(this.ticketsFiltradosTotales.length / this.itemsPorPagina);
  }





  cargarAreas(): void {
    this.areaService.getAllAreas().subscribe({
      next: (data) => {
        this.areas = data;
      },
      error: (err) => {
        console.error('Error al cargar áreas:', err);
        alert(' Error cargando áreas');
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
    // Modo “Nuevo Ticket”
    this.ticketForm = this.getTicketVacio();
    this.ticketForm.id_creador = Number(this.authService.getUserId() || 0);
    this.modoAsignar = false;
    this.modoVer = false;
    this.mostrarFormulario = true;
  }

  verTicket(ticket: Ticket): void {
    // Modo “Ver Ticket” (solo lectura)
    this.ticketForm = { ...ticket };
    this.modoVer = true;
    this.modoAsignar = false;
    this.mostrarFormulario = true;
  }

  activarAsignarDesdeVer(): void {
    // Cambia de lectura a asignación dentro del mismo modal
    this.ticketForm.estado_id = 2; // “En Proceso”
    this.modoVer = false;
    this.modoAsignar = true;
  }

  asignarTicket(ticket: Ticket): void {
    // Modo “Asignar Ticket” directo (sin pasar por Ver)
    this.ticketForm = { ...ticket };
    this.ticketForm.estado_id = 2; // “En Proceso”
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
      // En modoVer no guardamos nada: simplemente cerramos el modal
      this.cerrarFormulario();
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      alert(' No se pudo obtener el usuario autenticado.');
      return;
    }

    this.ticketForm.id_creador = Number(userId);

    if (this.modoAsignar) {
      // Guardar asignación (prioridad + técnico, estado ya en 2)
      if (!this.ticketForm.id) {
        alert(' El ticket no tiene ID para asignar.');
        return;
      }
      this.ticketService.updateTicket(this.ticketForm.id, this.ticketForm).subscribe({
        next: () => {
          alert(' Ticket asignado con éxito');
          this.cargarTickets();
          this.cerrarFormulario();
        },
        error: (err) => {
          console.error('Error asignar ticket:', err);
          alert(' Error al asignar ticket');
        }
      });
    } else {
      // Guardar nuevo ticket
      if (
        !this.ticketForm.asunto.trim() ||
        !this.ticketForm.descripcion.trim() ||
        this.ticketForm.area_id === 0
      ) {
        alert(' Completa asunto, descripción y área.');
        return;
      }
      this.ticketService.createTicket(this.ticketForm).subscribe({
        next: () => {
          alert(' Ticket registrado con éxito');
          this.cargarTickets();
          this.cerrarFormulario();
        },
        error: (err) => {
          console.error('Error registrando ticket:', err);
          alert(' Error al registrar ticket');
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
}
