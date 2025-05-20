import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // 👈 Ruta por defecto
    
    { path: 'login', component: LoginComponent }
];
