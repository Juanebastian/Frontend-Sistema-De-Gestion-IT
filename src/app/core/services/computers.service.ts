import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment.component';

@Injectable({
  providedIn: 'root',
})
export class ComputerService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.apiUrl;

  /** Genera headers con token de autorización */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /** Registra un nuevo usuario */
  registerComputer(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/computadores`, data, { headers }).pipe(
      catchError((err) => {
        console.error('❌ Error al registrar computadores:', err);
        return throwError(() => err);
      })
    );
  }

  /** Obtiene todos los usuarios */
  getAllComputers(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/computadores/`, { headers }).pipe(
      catchError((err) => {
        console.error('❌ Error al obtener computadores:', err);
        return throwError(() => err);
      })
    );
  }

  /** Actualiza un usuario por ID */
  updateComputer(userId: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/computadores/${userId}`, data, { headers }).pipe(
      catchError((err) => {
        console.error('❌ Error al actualizar computadores:', err);
        return throwError(() => err);
      })
    );
  }
}
