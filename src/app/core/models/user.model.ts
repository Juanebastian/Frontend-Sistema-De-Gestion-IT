// src/app/core/models/user.model.ts

export interface Usuario {
  id: number;          // asumo que el backend siempre devuelve un ID
  nombre: string;
  cedula: string;
  correo: string;
  // La contraseña no debería enviarse desde el servidor, pero la dejamos aquí para el formulario
  contrasena?: string;
  rol_id: number;
  area_id: number;
  activo: boolean;
}
