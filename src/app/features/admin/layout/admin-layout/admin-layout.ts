import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdminSidebar } from '@admin/components/admin-sidebar/admin-sidebar';

@Component({
  selector: 'admin-layout',
  imports: [AdminSidebar],
  templateUrl: './admin-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AdminLayout { }
