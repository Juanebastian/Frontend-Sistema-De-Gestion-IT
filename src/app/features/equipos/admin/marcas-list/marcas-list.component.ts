import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MarcaService } from '../../../../core/services/marca.service';

interface Marca {
  id?: number;
  nombre: string;
}
@Component({
  selector: 'app-marcas-list',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './marcas-list.component.html',
  styleUrl: './marcas-list.component.css'
})
export class MarcasListComponent implements OnInit {
  marcas: Marca[] = [];
  nuevaMarca: Marca = { nombre: '' };
  marcaEditando: Marca | null = null;

  cargando: boolean = false;
  error: string = '';
  mostrarFormulario: boolean = false;

  constructor(private marcaService: MarcaService) {}

  ngOnInit(): void {
    this.obtenerMarcas();
  }

  obtenerMarcas(): void {
    this.cargando = true;
    this.marcaService.getAllMarcas().subscribe({
      next: (data) => {
        this.marcas = data;
        this.cargando = false;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Error al cargar las marcas.';
        console.error(err);
        this.cargando = false;
      }
    });
  }

  abrirFormulario(marca?: Marca): void {
    if (marca) {
      this.marcaEditando = { ...marca };
      this.nuevaMarca = { ...marca };
    } else {
      this.marcaEditando = null;
      this.nuevaMarca = { nombre: '' };
    }
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.nuevaMarca = { nombre: '' };
    this.marcaEditando = null;
  }

  guardarMarca(): void {
    if (this.marcaEditando && this.marcaEditando.id != null) {
      this.marcaService.updateMarca(this.marcaEditando.id, this.nuevaMarca).subscribe({
        next: () => {
          alert('Marca actualizada correctamente.');
          this.obtenerMarcas();
          this.cerrarFormulario();
        },
        error: (err) => {
          this.error = 'Error al actualizar la marca.';
          console.error(err);
        }
      });
      return;
    }
  
    this.marcaService.registerMarca(this.nuevaMarca).subscribe({
      next: () => {
        alert('Marca registrada correctamente.');
        this.obtenerMarcas();
        this.cerrarFormulario();
      },
      error: (err) => {
        this.error = 'Error al crear la marca.';
        console.error(err);
      }
    });
  }
  

  editarMarca(marca: Marca): void {
    this.abrirFormulario(marca);
  }
}