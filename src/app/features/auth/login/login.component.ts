import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule  
  ]
})
export class LoginComponent {

 
 
  loginForm: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      correo: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
  
    this.loading = true;
    this.errorMsg = '';
  
    const { correo, contrasena } = this.loginForm.value;
  
    this.authService.login(correo, contrasena).subscribe({
      next: () => {
        this.loading = false;
        const user = this.authService.getUserInfo();
  
        switch (user?.rol_id) {
          case 1:
            this.router.navigate(['/administrador']);
            break;
          case 2:
            this.router.navigate(['/tecnicos']);
            break;
          case 3:
            this.router.navigate(['/colaboradores']);
            break;
          default:
            this.errorMsg = 'Rol de usuario no reconocido.';
            break;
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.loading = false;
        this.errorMsg = 'Usuario o contraseña incorrectos.';
      }
    });
  }
  

  
}

