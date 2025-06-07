import { Inject,Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment.component';

interface LoginResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    access_token: string;
    token_type: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private authState = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.authState.next(this.hasToken());
    }
  }


  login(correo: string, contrasena: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { correo, contrasena }).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.saveToken(response.data.access_token);
         
          this.authState.next(true);
        } else {
          throw new Error(response.message || 'Error al iniciar sesión');
        }
      }),
      catchError(error => {
        console.error('Error en login:', error);
        const message = error?.error?.message || error?.message || 'Error al iniciar sesión';
        return throwError(() => ({ message }));
      })
    );
  }

  logout(): void {
    this.clearToken();
    this.authState.next(false);
    this.router.navigate(['/']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState.asObservable();
  }

  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  }

  private saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }


  getUserInfo(): any {
    return this.getDecodedToken();
  }
  
  getUserId(): string | null {
    const user = this.getDecodedToken();
    return user?.id || null;
  }

  private clearToken(): void {
    localStorage.removeItem('auth_token');
  }

 
  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }




  getDecodedToken(): any | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      return jwtDecode<any>(token);
    } catch (error) {
      console.error('Error al decodificar el token JWT:', error);
      return null;
    }
  }
}
