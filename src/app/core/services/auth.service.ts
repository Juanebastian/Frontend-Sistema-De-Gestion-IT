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
          this.decodeAndSaveUserFromToken(); // <- Aquí decodificamos
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
    this.clearUserInfo();
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

  private saveUserInfo(usuario: any): void {
    localStorage.setItem('user_info', JSON.stringify(usuario));
  }

  getUserInfo(): any {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user_info'); // ✅ clave correcta
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  private clearToken(): void {
    localStorage.removeItem('auth_token');
  }

  private clearUserInfo(): void {
    localStorage.removeItem('user_info');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getUserId(): string | null {
    const user = this.getUserInfo();
    return user?.id || null;
  }

  /**
   * Decodifica el token y guarda los datos del usuario
   */
  private decodeAndSaveUserFromToken(): void {
    const token = this.getToken();
    if (!token) return;

    try {
      const decoded = jwtDecode<any>(token);
      this.saveUserInfo(decoded); // Guarda los datos: id, nombre, correo, etc.
    } catch (error) {
      console.error('Error al decodificar el token JWT:', error);
    }
  }
}
