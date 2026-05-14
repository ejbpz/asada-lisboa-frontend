import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { PrincipalRequest } from '@public/interfaces/principal-response.interface';

@Injectable({
  providedIn: 'root'
})
export class PrincipalApi {
  // Init
  private env = environment;

  // Injects
  private httpClient = inject(HttpClient);

  // Http calls
  public getPrincipalInformation(): Observable<PrincipalRequest> {
    return this.httpClient.get<PrincipalRequest>(`${this.env.API_URL_CLIENT}/principal`).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener la información.')))
    );
  }
}
