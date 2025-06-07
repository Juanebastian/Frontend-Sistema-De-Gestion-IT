// src/app/core/models/user.model.ts

export interface Usuario {
  id: number;        
  nombre: string;
  cedula: string;
  correo: string;
  //contrasena?: string;
  rol_id: number;
  area_id: number;
  activo: boolean;
}
