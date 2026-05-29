import { ActivatedRoute } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { NewsApi } from '@core/services/news-api';
import { AppError } from '@core/interfaces/app-error.interface';
import { AdminNewForm } from "@admin/components/admin-new-form/admin-new-form";
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";

@Component({
  selector: 'admin-individual-new-page',
  imports: [GetBackTitle, AdminNewForm],
  templateUrl: './admin-individual-new-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col justify-center items-center w-full container my-12.5 sm:items-start md:my-25'
  }
})
export default class AdminIndividualNewPage {
  // Injection
  private newsService = inject(NewsApi);

  // Getting slug from route
  private id = toSignal(
    inject(ActivatedRoute).params.pipe(
      map(param => param['id'])
    )
  );

  // Calling service to get new with that id
  protected readonly newResource = rxResource({
    params: () => ({ id: this.id() ?? '' }),
    stream: ({ params }) => {
      if(!params.id)
        return of(undefined);

      return this.newsService.getAdminNew(params.id).pipe(
        catchError((error: AppError) => {
          return of(undefined);
        })
      );
    }
  });
}
