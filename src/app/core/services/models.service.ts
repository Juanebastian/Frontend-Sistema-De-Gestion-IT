import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment.component';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/modelos`;

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  registerModelo(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, { headers: this.getAuthHeaders() }).pipe(
      catchError((err) => {
        console.error('❌ Error al registrar modelo:', err);
        return throwError(() => err);
      })
    );
  }

  getAllModelos(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError((err) => {
        console.error('❌ Error al obtener modelos:', err);
        return throwError(() => err);
      })
    );
  }

  updateModelo(modeloId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${modeloId}`, data, { headers: this.getAuthHeaders() }).pipe(
      catchError((err) => {
        console.error('❌ Error al actualizar modelo:', err);
        return throwError(() => err);
      })
    );
  }
}