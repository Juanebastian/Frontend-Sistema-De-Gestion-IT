import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComputerService } from '../../../../core/services/computers.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AreaService } from '../../../../core/services/area.service';
import { MarcaService } from '../../../../core/services/marca.service';
import { ModelService } from '../../../../core/services/models.service';
import { OsService } from '../../../../core/services/os.service';
import { UserService } from '../../../../core/services/user.service';
import { Computador } from '../../../../core/models/computer.model';


@Component({
  selector: 'app-equipos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './equipos-list.component.html',
  styleUrls: ['./equipos-list.component.css'],
})
export class EquiposListComponent implements OnInit {
  computadores: Computador[] = [];
  areas: any[] = []; 
  marcas: any[] = [];
  modelos: any[] = [];
  sistemasOperativos: any[] = [];
  usuarios: any[] = [];
  cargando = false;
  error = '';
  mostrarFormulario = false;
  computadorEditando: Computador | null = null;
  nuevoComputador: Computador = this.obtenerComputadorVacio();

  constructor(
    private computerService: ComputerService, 
    private areaService: AreaService ,
    private marcaService: MarcaService,
    private modeloService: ModelService,
    private soService: OsService,
    private userService: UserService,
    private authService: AuthService) {}
    

  ngOnInit(): void {
    this.cargarComputadores();
    this.cargarAreas(); 
    this.cargarMarcas(); // Nueva línea
    this.cargarModelos();
    this.cargarUsuarios();
    this.cargarSistemasOperativos();
  }

  cargarComputadores(): void {
    this.cargando = true;
    this.error = '';

    this.computerService.getAllComputers().subscribe({
      next: (data) => {
        this.computadores = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar computadores';
        console.error(err);
        this.cargando = false;
      },
    });
  }

  cargarAreas(): void {
    this.areaService.getAllAreas().subscribe({
      next: (data) => {
        this.areas = data;
      },
      error: (err) => {
        console.error('Error al cargar áreas:', err);
      }
    });
  }
  
  cargarMarcas(): void {
    this.marcaService.getAllMarcas().subscribe({
      next: (data) => {
        this.marcas = data;
      },
      error: (err) => {
        console.error('Error al cargar marcas:', err);
      }
    });
  }

  cargarModelos(): void {
    this.modeloService.getAllModelos().subscribe({
      next: (data) => {
        this.modelos = data;
      },
      error: (err) => {
        console.error('Error al cargar modelos:', err);
      }
    });
  }

  cargarSistemasOperativos(): void {
    this.soService.getAllOs().subscribe({
      next: (data) => {
        this.sistemasOperativos = data;
      },
      error: (err) => {
        console.error('Error al cargar sistemas operativos:', err);
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
    this.mostrarFormulario = true;
    this.computadorEditando = null;
    this.nuevoComputador = this.obtenerComputadorVacio();
  }

  editarComputador(pc: Computador): void {
    this.computadorEditando = pc;
    this.nuevoComputador = { ...pc };
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.nuevoComputador = this.obtenerComputadorVacio();
    this.computadorEditando = null;
  }

  guardarComputador(): void {
    const userId = this.authService.getUserId();

    if (!userId) {
      alert(' No se pudo obtener el usuario autenticado.');
      return;
    }

    this.nuevoComputador.id_registrado_por = +userId;

    if (this.computadorEditando) {
      this.computerService.updateComputer(this.computadorEditando.id!, this.nuevoComputador).subscribe({
        next: () => {
          alert(' Computador actualizado correctamente');
          this.cargarComputadores();
          this.cerrarFormulario();
        },
        error: (err) => {
          console.error(' Error al actualizar computador:', err);
          alert(' Error al actualizar computador');
        }
      });
    } else {
      this.computerService.registerComputer(this.nuevoComputador).subscribe({
        next: () => {
          alert(' Computador registrado con éxito');
          this.cargarComputadores();
          this.cerrarFormulario();
        },
        error: (err) => {
          console.error(' Error al registrar computador:', err);
          alert(' Error al registrar computador');
        }
      });
    }
  }

  obtenerComputadorVacio(): Computador {
    return {
      marca_id: 0,
      modelo_id: 0,
      sistema_operativo_id: 0,
      tipo_id: 0,
      area_id: 0,
      id_registrado_por: 0,
      ram: '',
      disco_duro: '',
      serie: '',
      codigo_inventario: '',
      fecha_adquisicion: '',
      activo: true,
      fecha_creacion: undefined,
      fecha_actualizacion: undefined,
    };
  }

  getNombreArea(areaId: number): string {
    const area = this.areas.find(a => a.id === areaId);
    return area ? area.nombre : 'Sin área';
  }

  getNombreMarca(marcaId: number): string {
    const marca = this.marcas.find(m => m.id === marcaId);
    return marca ? marca.nombre : 'Sin marca';
  }

  getNombreModelo(modeloId: number): string {
    const modelo = this.modelos.find(m => m.id === modeloId);
    return modelo ? modelo.nombre : 'Sin modelo';
  }

  getNombreSO(soId: number): string {
    const so = this.sistemasOperativos.find(s => s.id === soId);
    return so ? so.nombre : 'Sin SO';
  }

  getNombreTipoPC(tipo_id: number): string {
    const tipos: { [key: number]: string } = {
      1: 'Portátil',
      2: 'PC de escritorio',
      3: 'All-in-One',
      4: 'Tableta'
    };
    return tipos[tipo_id] || 'Desconocido';
  }

  getNombreUsuario(id: number): string {
    const usuario = this.usuarios.find(u => u.id === id);
    return usuario ? usuario.nombre : 'Desconocido';
  }

  
}
