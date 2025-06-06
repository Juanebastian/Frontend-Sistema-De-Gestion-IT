import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModelService } from '../../../../core/services/models.service';
import { Modelo } from '../../../../core/models/computer.model';



@Component({
  selector: 'app-modelos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './modelos-list.component.html',
  styleUrl: './modelos-list.component.css'
})
export class ModelosListComponent implements OnInit {
  modelos: Modelo[] = [];
  nuevoModelo: Modelo = { nombre: '' };
  modeloEditando: Modelo | null = null;

  cargando: boolean = false;
  error: string = '';
  mostrarFormulario: boolean = false;

  constructor(private modeloService: ModelService) {}

  ngOnInit(): void {
    this.obtenerModelos();
  }

  obtenerModelos(): void {
    this.cargando = true;
    this.modeloService.getAllModelos().subscribe({
      next: (data) => {
        this.modelos = data;
        this.cargando = false;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Error al cargar los modelos.';
        console.error(err);
        this.cargando = false;
      }
    });
  }

  abrirFormulario(modelo?: Modelo): void {
    if (modelo) {
      this.modeloEditando = { ...modelo };
      this.nuevoModelo = { ...modelo };
    } else {
      this.modeloEditando = null;
      this.nuevoModelo = { nombre: '' };
    }
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.nuevoModelo = { nombre: '' };
    this.modeloEditando = null;
  }

  guardarModelo(): void {
    if (this.modeloEditando && this.modeloEditando.id != null) {
      this.modeloService.updateModelo(this.modeloEditando.id, this.nuevoModelo).subscribe({
        next: () => {
          alert('Modelo actualizado correctamente.');
          this.obtenerModelos();
          this.cerrarFormulario();
        },
        error: (err) => {
          this.error = 'Error al actualizar el modelo.';
          console.error(err);
        }
      });
      return;
    }

    this.modeloService.registerModelo(this.nuevoModelo).subscribe({
      next: () => {
        alert('Modelo registrado correctamente.');
        this.obtenerModelos();
        this.cerrarFormulario();
      },
      error: (err) => {
        this.error = 'Error al crear el modelo.';
        console.error(err);
      }
    });
  }

  editarModelo(modelo: Modelo): void {
    this.abrirFormulario(modelo);
  }
}
