import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdminDashboard } from '@admin/components/admin-dashboard/admin-dashboard';

@Component({
  selector: 'admin-dashboard-page',
 imports: [AdminDashboard],
  templateUrl: './admin-dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-base-100 block w-full h-full'
  }
})
export default class AdminDashboardPage {}
