import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment.component';

@Injectable({
  providedIn: 'root',
})
export class MarcaService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/marcas`;

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  registerMarca(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, { headers: this.getAuthHeaders() }).pipe(
      catchError((err) => {
        console.error('❌ Error al registrar marca:', err);
        return throwError(() => err);
      })
    );
  }

  getAllMarcas(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError((err) => {
        console.error('❌ Error al obtener marcas:', err);
        return throwError(() => err);
      })
    );
  }

  updateMarca(marcaId: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/${marcaId}`, data, { headers }).pipe(
      catchError((err) => {
        console.error('❌ Error al actualizar marca:', err);
        return throwError(() => err);
      })
    );
  }
}
