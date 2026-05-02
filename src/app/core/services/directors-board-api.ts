import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { PageResponse } from '@shared/interfaces/page-response.interface';
import { DirectorsBoardResponse } from '@public/interfaces/directors-board-response.interface';

@Injectable({
  providedIn: 'root'
})
export class DirectorsBoardApi {
   // Init
  private env = environment;

  // Inject
  private httpClient = inject(HttpClient);

  // Http calls - public
  public getDirectorsBoardInformation(): Observable<DirectorsBoardResponse[]> {
    return this.httpClient.get<DirectorsBoardResponse[]>(`${this.env.API_URL_CLIENT}/usuarios`);
  }

  // Http calls - admin
  public getAdminUsers(params: HttpParams): Observable<PageResponse<DirectorsBoardResponse>> {
    return this.httpClient.get<PageResponse<DirectorsBoardResponse>>(`${this.env.API_URL_ADMIN}/usuarios`, { params })
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => error.error?.detail ?? error?.message ?? 'Error inesperado al obtener los usuarios.'))
      );
  }

  public getAdminUser(id: string): Observable<DirectorsBoardResponse> {
    return this.httpClient.get<DirectorsBoardResponse>(`${this.env.API_URL_ADMIN}/usuarios/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => error.error?.detail ?? error?.message ?? 'Error inesperado al obtener los usuarios.'))
      );
  }

  public deleteUser(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.env.API_URL_ADMIN}/usuarios/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => error.error?.detail ?? error?.message ?? 'Error inesperado al eliminar al usuario.'))
      );
  }
}
