import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { StatusResponse } from '@admin/interfaces/status-response.interface';

@Injectable({
  providedIn: 'root'
})
export class StatusesApi {
  // Init
  private env = environment;

  // Injects
  private httpClient = inject(HttpClient);

  // Http calls
  public getStatuses(): Observable<StatusResponse[]> {
    return this.httpClient.get<StatusResponse[]>(`${this.env.API_URL_ADMIN}/estados`).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener estados.')))
    );
  }
}
