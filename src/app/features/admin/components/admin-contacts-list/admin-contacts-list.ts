import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ContactResponse } from '@public/interfaces/contact-response.interface';

@Component({
  selector: 'admin-contacts-list',
  imports: [],
  templateUrl: './admin-contacts-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex flex-wrap items-center gap-2'
  }
})
export class AdminContactsList {
  // Input signal
  public contactsInput = input.required<ContactResponse[]>();
}
