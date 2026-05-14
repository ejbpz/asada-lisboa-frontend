import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { PageResponse } from '@shared/interfaces/page-response.interface';
import { DocumentRequest } from '@admin/interfaces/document-request.interface';
import { DocumentResponse } from '@admin/interfaces/document-response.interface';
import { DocumentMinimalResponse } from '@public/interfaces/document-minimal-response.interface';
import { map } from 'rxjs/operators';

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
  public getAdminDocuments(params: HttpParams): Observable<PageResponse<DocumentResponse>> {
    return this.httpClient.get<PageResponse<DocumentResponse>>(`${this.env.API_URL_ADMIN}/documentos`, { params }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener los documentos.')))
    );
  }

  public getAdminDocument(id: string): Observable<DocumentResponse> {
    return this.httpClient.get<DocumentResponse>(`${this.env.API_URL_ADMIN}/documentos/${id}`).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener el documento.')))
    );
  }

  public deleteDocument(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.env.API_URL_ADMIN}/documentos/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al eliminar el documento.')))
      );
  }

  public createOrEditDocument(newRequest: DocumentRequest, id: string | undefined = undefined): Observable<DocumentResponse> {
    const formData = new FormData();

    formData.append('title', newRequest.title);

    if(newRequest.file)
      formData.append('file', newRequest.file);

    formData.append('statusId', newRequest.statusId);
    formData.append('description', newRequest.description);

    newRequest.categories.forEach((cat: any, index: number) => {
      if (cat.id !== null && cat.id !== undefined)
        formData.append(`categories[${index}].id`, cat.id);

      formData.append(`categories[${index}].name`, cat.name);
    });

    if(id !== null && id !== undefined) {
      return this.httpClient.put<DocumentResponse>(`${this.env.API_URL_ADMIN}/documentos/${id}`, formData)
        .pipe(
          catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al actualizar el documento.')))
        );
    }

    return this.httpClient.post<DocumentResponse>(`${this.env.API_URL_ADMIN}/documentos`, formData)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al crear el documento.')))
      );
  }

  public getAdmindocument2(params: HttpParams): Observable<DocumentMinimalResponse[]> {
    return this.httpClient
      .get<PageResponse<DocumentMinimalResponse>>(`${this.env.API_URL_ADMIN}/documentos`, { params })
      .pipe(       
        map(response => response.data),
         catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al crear el documento.')))
      );
  }
}
