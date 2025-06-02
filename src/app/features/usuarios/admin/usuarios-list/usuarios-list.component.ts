import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuariosListComponent implements OnInit {
  usuarios: any[] = [];
  cargando = false;
  error: string | null = null;

  mostrarFormulario = false;
  usuarioEditando: any = null;

  nuevoUsuario: any = this.usuarioVacio();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  usuarioVacio(): any {
    return {
      nombre: '',
      cedula: '',
      correo: '',
      contrasena: '',
      rol_id: 0,
      area_id: 0,
      activo: true
    };
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.error = null;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.error = 'Error al cargar usuarios';
        this.cargando = false;
      }
    });
  }

  abrirFormulario(): void {
    this.usuarioEditando = null;
    this.nuevoUsuario = this.usuarioVacio();
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.usuarioEditando = null;
    this.nuevoUsuario = this.usuarioVacio();
  }

  guardarUsuario(): void {
    if (this.usuarioEditando) {
      // Actualización
      const usuarioActualizado = {
        ...this.usuarioEditando,
        ...this.nuevoUsuario
      };

      this.userService.updateUser(usuarioActualizado.id, usuarioActualizado).subscribe({
        next: () => {
          alert('✅ Usuario actualizado correctamente');
          this.cargarUsuarios();
          this.cerrarFormulario();
        },
        error: (err) => {
          console.error('❌ Error al actualizar usuario:', err);
          alert('❌ Error al actualizar usuario');
        }
      });
    } else {
      // Registro
      this.userService.registerUser(this.nuevoUsuario).subscribe({
        next: () => {
          alert('✅ Usuario registrado con éxito');
          this.cargarUsuarios();
          this.cerrarFormulario();
        },
        error: (err) => {
          console.error('❌ Error al registrar usuario:', err);
          alert('❌ Error al registrar usuario');
        }
      });
    }
  }

  editarUsuario(usuario: any): void {
    this.usuarioEditando = usuario;
    this.nuevoUsuario = {
      nombre: usuario.nombre || '',
      cedula: usuario.cedula || '',
      correo: usuario.correo || '',
      contrasena: '', // Por seguridad
      rol_id: usuario.rol_id || 0,
      area_id: usuario.area_id || 0,
      activo: usuario.activo ?? true
    };
    this.mostrarFormulario = true;
  }
}
