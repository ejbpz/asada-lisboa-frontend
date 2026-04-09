import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { GlobalFooter } from "@shared/components/global-footer/global-footer";

@Component({
  selector: 'admin-sidebar',
  imports: [RouterOutlet, RouterLinkWithHref, GlobalFooter],
  templateUrl: './admin-sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSidebar {
  protected navigationLinks = [
    { title: 'Usuarios', link: 'admin/usuarios', imageUrl: 'assets/icons/user-icon.svg' },
    { title: 'Galería', link: 'admin/galeria', imageUrl: 'assets/icons/image-icon.svg' },
    { title: 'Noticias', link: 'admin/noticias', imageUrl: 'assets/icons/new-icon.svg' },
    { title: 'Documentos', link: 'admin/documentos', imageUrl: 'assets/icons/document-icon.svg' },
    { title: 'Configuraciones', link: 'admin/configuraciones', imageUrl: 'assets/icons/settings-icon.svg' },
  ]
}
