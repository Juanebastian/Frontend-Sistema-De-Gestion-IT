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
    private apiUrl = `${environment.apiUrl}/users`;
  
 

  registerUser(data: any): Observable<any> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${environment.apiUrl}/auth/register`, data, { headers }).pipe(
      catchError((err) => {
        console.error('❌ Error en UserService:', err);
        return throwError(() => err);
      })
    );
  }



  getAllUsers(): Observable<any> {
    const token = this.authService.getToken();
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.get('http://127.0.0.1:8000/usuarios/', { headers }).pipe(
      catchError((err) => {
        console.error('❌ Error al obtener usuarios:', err);
        return throwError(() => err);
      })
    );
  }

  
  updateUser(userId: number, data: any): Observable<any> {
    const token = this.authService.getToken();
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.put(`http://127.0.0.1:8000/usuarios/${userId}`, data, { headers }).pipe(
      catchError((err) => {
        console.error('❌ Error al actualizar usuario:', err);
        return throwError(() => err);
      })
    );
  }

  getAuditores(): Observable<any> {
    const token = this.authService.getToken();
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.get(`${this.apiUrl}/auditores`, { headers }).pipe(
      catchError((err) => {
        console.error('❌ Error al obtener auditores:', err);
        return throwError(() => err);
      })
    );
  }
}
