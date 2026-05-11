import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ContactApi } from '@core/services/contact-api';
import { AboutUsApi } from '@core/services/about-us-api';
import { ContactResponse } from '@public/interfaces/contact-response.interface';
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import { AboutUsResponse } from '@public/interfaces/about-us-response.interface';
import { AdminAboutUsList } from '@admin/components/admin-about-us-list/admin-about-us-list';
import { AdminContactsList } from "@admin/components/admin-contacts-list/admin-contacts-list";

@Component({
  selector: 'admin-configurations-page',
  imports: [GetBackTitle, AdminContactsList, AdminAboutUsList],
  templateUrl: './admin-configurations-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col justify-center items-center w-full container my-12.5 md:my-25'
  }
})
export default class AdminConfigurationsPage implements OnInit {
  // Init
  protected contacts = signal<ContactResponse[]>([]);
  protected aboutUs = signal<AboutUsResponse[]>([]);

  // Injections
  private AboutUsApi = inject(AboutUsApi);
  private contactsApi = inject(ContactApi);

  ngOnInit(): void {
    this.contactsList();
    this.configurationList();
  }

  // Http call configurations
  private configurationList() {
    this.AboutUsApi.getAboutUsInformation()
      .subscribe({
        next: (data: AboutUsResponse[]) => {
          this.aboutUs.set(data);
        }
      })
  }

  private contactsList() {
    this.contactsApi.getAdminContacts()
      .subscribe({
        next: (data: ContactResponse[]) => {
          this.contacts.set(data);
        }
      })
  }
}
