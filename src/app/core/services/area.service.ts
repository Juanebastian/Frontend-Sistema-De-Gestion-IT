import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment.component';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/areas`;

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  registerArea(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, { headers: this.getAuthHeaders() }).pipe(
      catchError((err) => {
        console.error('❌ Error al registrar área:', err);
        return throwError(() => err);
      })
    );
  }

  getAllAreas(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError((err) => {
        console.error('❌ Error al obtener áreas:', err);
        return throwError(() => err);
      })
    );
  }


  /** Actualiza un área por ID */
  updateArea(areaId: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/${areaId}`, data, { headers }).pipe(
      catchError((err) => {
        console.error('❌ Error al actualizar área:', err);
        return throwError(() => err);
      })
    );
  }
}
