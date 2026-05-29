import { ActivatedRoute } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { AppError } from '@core/interfaces/app-error.interface';
import { DirectorsBoardApi } from '@core/services/directors-board-api';
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import { AdminUpdateUserForm } from "@admin/components/admin-update-user-form/admin-update-user-form";

@Component({
  selector: 'admin-update-user-page',
  imports: [GetBackTitle, AdminUpdateUserForm],
  templateUrl: './admin-update-user-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col justify-center items-center w-full container my-12.5 sm:items-start md:my-25'
  }
})
export default class AdminUpdateUserPage {
  // Injection
  private usersService = inject(DirectorsBoardApi);

  // Getting slug from route
  private id = toSignal(
    inject(ActivatedRoute).params.pipe(
      map(param => param['id'])
    )
  );

  // Calling service to get user with that id
  protected readonly userResource = rxResource({
    params: () => ({ id: this.id() ?? '' }),
    stream: ({ params }) => {
      if(!params.id)
        return of(undefined);

      return this.usersService.getAdminUser(params.id).pipe(
        catchError((error: AppError) => {
          return of(undefined);
        })
      );
    }
  });
}
