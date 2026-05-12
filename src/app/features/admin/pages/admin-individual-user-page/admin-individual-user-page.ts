import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import { AdminUserForm } from "@admin/components/admin-user-form/admin-user-form";

@Component({
  selector: 'admin-individual-user-page',
  imports: [GetBackTitle, AdminUserForm],
  templateUrl: './admin-individual-user-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col justify-center items-center w-full container my-12.5 sm:items-start md:my-25'
  }
})
export default class AdminIndividualUserPage { }
