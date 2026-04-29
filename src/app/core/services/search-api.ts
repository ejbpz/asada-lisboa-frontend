import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { PageResponse } from '@shared/interfaces/page-response.interface';
import { SearchReponse } from '@public/interfaces/search-reponse.interface';
import { SearchRequest } from '@public/interfaces/search-request.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchApi {

 // Init
  private env = environment;

  // Inject
  private httpClient = inject(HttpClient);

  // Http calls
  public getsearchInformation(): Observable<SearchReponse[]> {
    return this.httpClient.get<PageResponse<SearchReponse>>(`${this.env.API_URL_CLIENT}/buscador`)
      .pipe(
        map((response: PageResponse<SearchReponse>) => response.data),
         catchError((error: HttpErrorResponse) => throwError(() => error.error?.detail ?? error?.message ?? 'Error al mostrar los datos.'))
      );
  }

  
  public search(request: SearchRequest): Observable<SearchReponse[]> {
    return this.httpClient.post<SearchReponse[]>(`/api/buscador`,request);
}

}
