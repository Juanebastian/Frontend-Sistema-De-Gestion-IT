import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment.component';

@Injectable({
  providedIn: 'root',
})
export class UserService {
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
  registerUser(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/auth/register`, data, { headers }).pipe(
      catchError((err) => {
        console.error('❌ Error al registrar usuario:', err);
        return throwError(() => err);
      })
    );
  }

  /** Obtiene todos los usuarios */
  getAllUsers(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/usuarios/`, { headers }).pipe(
      catchError((err) => {
        console.error('❌ Error al obtener usuarios:', err);
        return throwError(() => err);
      })
    );
  }

  /** Actualiza un usuario por ID */
  updateUser(userId: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/usuarios/${userId}`, data, { headers }).pipe(
      catchError((err) => {
        console.error('❌ Error al actualizar usuario:', err);
        return throwError(() => err);
      })
    );
  }

  getUserById(userId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/usuarios/${userId}`, { headers }).pipe(
      catchError((err) => {
        console.error('❌ Error al obtener usuario por ID:', err);
        return throwError(() => err);
      })
    );
  }
}
