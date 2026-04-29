import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, Router } from '@angular/router';
import { AuthApi } from '@core/services/auth-api';
import { GlobalFooter } from "@shared/components/global-footer/global-footer";

@Component({
  selector: 'admin-sidebar',
  imports: [RouterOutlet, RouterLinkWithHref, GlobalFooter],
  templateUrl: './admin-sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSidebar {
  // Init
  protected navigationLinks = [
    { title: 'Inicio', link: '/', imageUrl: 'assets/icons/home-icon.svg' },
    { title: 'Usuarios', link: '/admin/usuarios', imageUrl: 'assets/icons/user-icon.svg' },
    { title: 'Galería', link: '/admin/galeria', imageUrl: 'assets/icons/image-icon.svg' },
    { title: 'Noticias', link: '/admin/noticias', imageUrl: 'assets/icons/new-icon.svg' },
    { title: 'Documentos', link: '/admin/documentos', imageUrl: 'assets/icons/admin-document-icon.svg' },
    { title: 'Configuraciones', link: '/admin/configuraciones', imageUrl: 'assets/icons/settings-icon.svg' },
  ];

  // Injects
  private router = inject(Router);
  private authApiService = inject(AuthApi);

  // Calling logout API
  protected onLogout() {
    this.authApiService.logoutUser()
      .subscribe({
        complete: () => {
          this.router.navigate(['/cuenta/iniciar-sesion']);
        }
      });
  }
}
