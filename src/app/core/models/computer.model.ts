// src/app/models/ticket.model.ts

export interface Computador {
  id?: number;
  marca_id: number;
  modelo_id: number;
  sistema_operativo_id: number;
  tipo_id: number;
  area_id: number;
  id_registrado_por: number;
  ram: string;
  disco_duro: string;
  serie: string;
  codigo_inventario: string;
  fecha_adquisicion: string;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface Marca {
  id?: number;
  nombre: string;
}

export interface Modelo {
  id?: number;
  nombre: string;
}

export interface SistemaOperativo {
  id?: number;
  nombre: string;
}