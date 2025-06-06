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
        console.error('❌ Error al crear ticket:', err);
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
        console.error('❌ Error al obtener tickets:', err);
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
        console.error('❌ Error al actualizar ticket:', err);
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
        console.error(`❌ Error al obtener ticket con ID ${ticketId}:`, err);
        return throwError(() => err);
      })
    );
  }


    /** Cierra un ticket usando PUT /tickets/{id}/cerrar */
    cerrarTicket(ticketId: number): Observable<any> {
      return this.http
        .put(
          `${this.apiUrl}/${ticketId}/cerrar`,
          {}, // no enviamos body
          { headers: this.getAuthHeaders() }
        )
        .pipe(
          catchError((err) => {
            console.error(`❌ Error al cerrar ticket ${ticketId}:`, err);
            return throwError(() => err);
          })
        );
    }
}
