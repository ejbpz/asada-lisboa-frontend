import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { PageResponse } from '@public/interfaces/page-response.interface';
import { DirectorsBoardResponse } from '@public/interfaces/directors-board-response.interface';

@Injectable({
  providedIn: 'root'
})
export class DirectorsBoardApi {

   // Init
  private env = environment;

  // Inject
  private httpClient = inject(HttpClient);
  
  public getDirectorsBoardInformation(): Observable<DirectorsBoardResponse[]> {
    return this.httpClient.get<PageResponse<DirectorsBoardResponse>>(`${this.env.API_URL_CLIENT}/junta-directiva`)
      .pipe(
        map((response: PageResponse<DirectorsBoardResponse>) => response.data),
      );
  }

}
