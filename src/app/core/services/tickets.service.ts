import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment.component';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/tickets`;

  /** Genera headers con token de autorización */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  /** Crea un nuevo ticket */
  createTicket(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((err) => {
        console.error(' Error al crear ticket:', err);
        return throwError(() => err);
      })
    );
  }

  /** Obtiene todos los tickets */
  getAllTickets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((err) => {
        console.error(' Error al obtener tickets:', err);
        return throwError(() => err);
      })
    );
  }

  /** Actualiza un ticket por ID */
  updateTicket(ticketId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${ticketId}`, data, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((err) => {
        console.error(' Error al actualizar ticket:', err);
        return throwError(() => err);
      })
    );
  }

  /** Obtiene un ticket por su ID */
  getTicketById(ticketId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${ticketId}`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((err) => {
        console.error(` Error al obtener ticket con ID ${ticketId}:`, err);
        return throwError(() => err);
      })
    );
  }



  cerrarTicket(ticketId: number, observaciones?: string): Observable<any> {
    const body = observaciones !== undefined
      ? { observaciones }
      : {};

    return this.http.put(
      `${this.apiUrl}/${ticketId}/cerrar`,
      body,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError((err) => {
        console.error(` Error al cerrar ticket ${ticketId}:`, err);
        return throwError(() => err);
      })
    );
  }

  
    getTicketsByTecnicoId(id_tecnico: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/tecnico/${id_tecnico}`, {
        headers: this.getAuthHeaders(),
      }).pipe(
        catchError((err) => {
          console.error(` Error al obtener tickets del técnico con ID ${id_tecnico}:`, err);
          return throwError(() => err);
        })
      );
    }

    /** Obtiene tickets creados por un colaborador (id_creador) */
    getTicketsByColaboradorId(id_colaborador: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/colaborador/${id_colaborador}`, {
        headers: this.getAuthHeaders(),
      }).pipe(
        catchError((err) => {
          console.error(` Error al obtener tickets del colaborador con ID ${id_colaborador}:`, err);
          return throwError(() => err);
        })
      );
    }



}
