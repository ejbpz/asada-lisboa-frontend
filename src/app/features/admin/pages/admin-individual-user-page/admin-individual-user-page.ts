import { ActivatedRoute } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map, of } from 'rxjs';
import { DirectorsBoardApi } from '@core/services/directors-board-api';
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
export default class AdminIndividualUserPage {
  // Injection
  private usersService = inject(DirectorsBoardApi);

  // Getting slug from route
  private id = toSignal(
    inject(ActivatedRoute).params.pipe(
      map(param => param['id'])
    )
  );

  // Calling service to get user with that id
  protected userResource = rxResource({
    params: () => ({ id: this.id() ?? '' }),
    stream: ({ params }) => {
      if(!params.id)
        return of(undefined);

      return this.usersService.getAdminUser(params.id);
    }
  });
}
