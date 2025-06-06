import { Component, OnInit } from '@angular/core';
import { AreaService } from '../../../core/services/area.service';
import { CommonModule } from '@angular/common'; // Importa CommonModule para usar ngIf, ngFor, etc.
import { FormsModule } from '@angular/forms'; // Importa FormsModule para usar ngModel
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule para las peticiones HTTP   
import { Area } from '../../../core/models/area.model';



@Component({
  selector: 'app-admin-areas',
  imports: [CommonModule , FormsModule , HttpClientModule],
  templateUrl: './admin-areas.component.html',
  styleUrls: ['./admin-areas.component.css']
})
export class AdminAreasComponent implements OnInit {
  areas: Area[] = [];
  nuevoArea: Area = { nombre: '', ubicacion: '' };
  areaEditando: Area | null = null;

  cargando: boolean = false;
  error: string = '';
  mostrarFormulario: boolean = false;

  constructor(private areaService: AreaService) {}

  ngOnInit(): void {
    this.obtenerAreas();
  }

  obtenerAreas(): void {
    this.cargando = true;
    this.areaService.getAllAreas().subscribe({
      next: (data) => {
        this.areas = data;
        this.cargando = false;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Error al cargar las áreas.';
        console.error(err);
        this.cargando = false;
      }
    });
  }

  abrirFormulario(area?: Area): void {
    if (area) {
      this.areaEditando = { ...area };
      this.nuevoArea = { ...area };
    } else {
      this.areaEditando = null;
      this.nuevoArea = { nombre: '', ubicacion: '' };
    }
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.nuevoArea = { nombre: '', ubicacion: '' };
    this.areaEditando = null;
  }

  guardarArea(): void {
    if (this.areaEditando && this.areaEditando.id != null) {
      // Llamar al servicio para actualizar
      this.areaService.updateArea(this.areaEditando.id, this.nuevoArea).subscribe({
        next: () => {
          this.obtenerAreas();
          this.cerrarFormulario();
        },
        error: (err) => {
          this.error = 'Error al actualizar el área.';
          console.error(err);
        }
      });
      return;
    }
  
    // Crear nuevo área
    this.areaService.registerArea(this.nuevoArea).subscribe({
      next: () => {
        this.obtenerAreas();
        this.cerrarFormulario();
      },
      error: (err) => {
        this.error = 'Error al crear el área.';
        console.error(err);
      }
    });
  }
  

  editarArea(area: Area): void {
    this.abrirFormulario(area);
  }
}
