import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { PageResponse } from '@shared/interfaces/page-response.interface';
import { DocumentMinimalResponse } from '@public/interfaces/document-minimal-response.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentsApi {
  // Init
  private env = environment;

  // Injection
  private httpClient = inject(HttpClient);

  // Http public calls
  public getPublicDocuments(params: HttpParams): Observable<PageResponse<DocumentMinimalResponse>> {
    return this.httpClient.get<PageResponse<DocumentMinimalResponse>>(`${this.env.API_URL_CLIENT}/documentos`, { params }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener los documentos.')))
    );
  }

  // Http admin calls
  public getAdminDocuments(params: HttpParams): Observable<PageResponse<DocumentMinimalResponse>> {
    return this.httpClient.get<PageResponse<DocumentMinimalResponse>>(`${this.env.API_URL_ADMIN}/documentos`, { params }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener los documentos.')))
    );
  }

  public deleteDocument(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.env.API_URL_ADMIN}/documentos/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al eliminar el documento.')))
      );
  }
}
