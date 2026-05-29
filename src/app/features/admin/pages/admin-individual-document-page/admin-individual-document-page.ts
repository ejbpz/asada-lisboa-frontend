import { ActivatedRoute } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { DocumentsApi } from '@core/services/documents-api';
import { AppError } from '@core/interfaces/app-error.interface';
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import { AdminDocumentForm } from "@admin/components/admin-document-form/admin-document-form";

@Component({
  selector: 'admin-individual-document-page',
  imports: [GetBackTitle, AdminDocumentForm],
  templateUrl: './admin-individual-document-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col justify-center items-center w-full container my-12.5 sm:items-start md:my-25'
  }
})
export default class AdminIndividualDocumentPage {
  // Injection
  private documentsService = inject(DocumentsApi);

  // Getting slug from route
  private id = toSignal(
    inject(ActivatedRoute).params.pipe(
      map(param => param['id'])
    )
  );

  // Calling service to get document with that id
  protected readonly documentResource = rxResource({
    params: () => ({ id: this.id() ?? '' }),
    stream: ({ params }) => {
      if(!params.id)
        return of(undefined);

      return this.documentsService.getAdminDocument(params.id).pipe(
        catchError((error: AppError) => {
          return of(undefined);
        })
      );
    }
  });
}
