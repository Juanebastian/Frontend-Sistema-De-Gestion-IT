// src/app/models/ticket.model.ts

export interface Ticket {
    id?: number;
    asunto: string;
    descripcion: string;
    estado_id: number;
    prioridad_id: number;
    id_creador: number;
    id_tecnico: number;
    area_id: number;
    observaciones : string;
    fecha_creacion?: string;
    fecha_actualizacion?: string;
    fecha_cierre?: string | null;
  }

  export interface Estado {
    id: number;
    nombre: string;
  }
  
  export interface Prioridad {
    id: number;
    nombre: string;
  }