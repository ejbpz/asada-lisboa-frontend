import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import { AdminNewForm } from "@admin/components/admin-new-form/admin-new-form";

@Component({
  selector: 'admin-individual-new-page',
  imports: [GetBackTitle, AdminNewForm],
  templateUrl: './admin-individual-new-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col justify-center items-center w-full container my-12.5 sm:items-start md:my-25'
  }
})
export default class AdminIndividualNewPage { }
