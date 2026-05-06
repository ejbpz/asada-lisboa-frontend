import { ActivatedRoute } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map, of } from 'rxjs';
import { GalleryApi } from '@core/services/gallery-api';
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import { AdminImageForm } from "@admin/components/admin-image-form/admin-image-form";

@Component({
  selector: 'admin-individual-image-page',
  imports: [GetBackTitle, AdminImageForm],
  templateUrl: './admin-individual-image-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col justify-center items-center w-full container my-12.5 sm:items-start md:my-25'
  }
})
export default class AdminIndividualImagePage {
  // Injection
  private imagesService = inject(GalleryApi);

  // Getting slug from route
  private id = toSignal(
    inject(ActivatedRoute).params.pipe(
      map(param => param['id'])
    )
  );

  // Calling service to get image with that id
  protected imageResource = rxResource({
    params: () => ({ id: this.id() ?? '' }),
    stream: ({ params }) => {
      if(!params.id)
        return of(undefined);

      return this.imagesService.getAdminImage(params.id);
    }
  });
}
