import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../../layouts/header/header.component';
import { SidebarComponent } from '../../../../layouts/sidebar/sidebar.component';
import { AuthService } from '../../../../core/services/auth.service';
import { FooterComponent } from "../../../../layouts/footer/footer.component";

@Component({
  selector: 'app-colaboradores-layout',
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
],
  templateUrl: './colaboradores-layout.component.html',
  styleUrl: './colaboradores-layout.component.css'
})
export class ColaboradoresLayoutComponent {
  sidebarCollapsed = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUserInfo();

    if (!user || user.rol_id !== 3) {
      this.router.navigate(['/login']);
    }
  }


  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
