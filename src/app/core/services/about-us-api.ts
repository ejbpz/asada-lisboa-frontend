import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { PageResponse } from '@shared/interfaces/page-response.interface';
import { AboutUsResponse} from '@public/interfaces/about-us-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AboutUsApi {
   // Init
   private env = environment;

   // Inject
   private httpClient = inject(HttpClient);

   // HttpCalls
    public getAboutUsInformation(): Observable<AboutUsResponse[]> {
     return this.httpClient.get<PageResponse<AboutUsResponse>>(`${this.env.API_URL_CLIENT}/nosotros`)
       .pipe(
         map((response: PageResponse<AboutUsResponse>) => response.data),
         catchError((error: HttpErrorResponse) => throwError(() => error.error?.detail ?? error?.message ?? 'Error al obtener los datos.'))
      );
    }
}
