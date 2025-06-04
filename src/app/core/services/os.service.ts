import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment.component';

@Injectable({
  providedIn: 'root',
})
export class OsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/sistemas-operativos`;

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /** Registra un nuevo sistema operativo */
  registerOs(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, { headers: this.getAuthHeaders() }).pipe(
      catchError((err) => {
        console.error('❌ Error al registrar sistema operativo:', err);
        return throwError(() => err);
      })
    );
  }

  /** Obtiene todos los sistemas operativos */
  getAllOs(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError((err) => {
        console.error('❌ Error al obtener sistemas operativos:', err);
        return throwError(() => err);
      })
    );
  }

  /** Actualiza un sistema operativo por ID */
  updateOs(osId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${osId}`, data, { headers: this.getAuthHeaders() }).pipe(
      catchError((err) => {
        console.error('❌ Error al actualizar sistema operativo:', err);
        return throwError(() => err);
      })
    );
  }
}
