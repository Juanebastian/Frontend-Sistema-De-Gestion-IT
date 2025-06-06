import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OsService } from '../../../../core/services/os.service';
import { SistemaOperativo } from '../../../../core/models/computer.model';



@Component({
  selector: 'app-sistemas-operativos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './sistemas-operativos-list.component.html',
  styleUrls: ['./sistemas-operativos-list.component.css'] // << corregido: era `styleUrl`
})
export class SistemasOperativosListComponent implements OnInit {
  sistemas: SistemaOperativo[] = [];
  nuevoSistema: SistemaOperativo = { nombre: '' };
  sistemaEditando: SistemaOperativo | null = null;

  cargando: boolean = false;
  error: string = '';
  mostrarFormulario: boolean = false;

  constructor(private osService: OsService) {}

  ngOnInit(): void {
    this.obtenerSistemas();
  }

  obtenerSistemas(): void {
    this.cargando = true;
    this.osService.getAllOs().subscribe({
      next: (data) => {
        this.sistemas = data;
        this.cargando = false;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Error al cargar los sistemas operativos.';
        console.error(err);
        this.cargando = false;
      }
    });
  }

  abrirFormulario(sistema?: SistemaOperativo): void {
    if (sistema) {
      this.sistemaEditando = { ...sistema };
      this.nuevoSistema = { ...sistema };
    } else {
      this.sistemaEditando = null;
      this.nuevoSistema = { nombre: '' };
    }
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.nuevoSistema = { nombre: '' };
    this.sistemaEditando = null;
  }

  guardarSistema(): void {
    if (this.sistemaEditando && this.sistemaEditando.id != null) {
      this.osService.updateOs(this.sistemaEditando.id, this.nuevoSistema).subscribe({
        next: () => {
          alert('Sistema operativo actualizado correctamente.');
          this.obtenerSistemas();
          this.cerrarFormulario();
        },
        error: (err) => {
          this.error = 'Error al actualizar el sistema operativo.';
          console.error(err);
        }
      });
    } else {
      this.osService.registerOs(this.nuevoSistema).subscribe({
        next: () => {
          alert('Sistema operativo registrado correctamente.');
          this.obtenerSistemas();
          this.cerrarFormulario();
        },
        error: (err) => {
          this.error = 'Error al crear el sistema operativo.';
          console.error(err);
        }
      });
    }
  }

  editarSistema(sistema: SistemaOperativo): void {
    this.abrirFormulario(sistema);
  }
}
