import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, 
    {
        path: 'administrador',
        loadChildren: () => import('./features/usuarios/admin/admin-layout/admin.routes') 
      },
    { path: 'login', component: LoginComponent }
];
