import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PrincipalApi } from '@core/services/principal-api';
import { PrincipalRequest } from '@public/interfaces/principal-response.interface';
import { AdminDashboard } from '@admin/components/admin-dashboard-list/admin-dashboard-list';

@Component({
  selector: 'admin-dashboard-page',
 imports: [AdminDashboard],
  templateUrl: './admin-dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-base-100 block w-full h-full'
  }
})
export default class AdminDashboardPage {
    // Init
  protected isLoading = signal<boolean>(false);
  protected principalData = signal<PrincipalRequest | null>(null);

  // Injects
  private principalService = inject(PrincipalApi);

  // AfterViewInit
  ngAfterViewInit(): void {
    this.principalApiService();
  }

  // Calling principal API
  protected principalApiService(): void {
      if(this.isLoading())
        return;

      this.isLoading.set(true);

      this.principalService.getPrincipalAdminInformation()
        .subscribe({
          next: (principalRequest: PrincipalRequest) => {
            this.principalData.set(principalRequest);
            this.isLoading.set(false);
          }
        });
  }
}
