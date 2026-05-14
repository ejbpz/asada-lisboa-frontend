import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { EditorResponse } from '@admin/interfaces/editor-response.interface';

@Injectable({
  providedIn: 'root'
})
export class RichEditorApi {
  // Init
  private env = environment;

  // Inject
  private httpClient = inject(HttpClient);

  // HttpCalls
  public uploadTemporalImage(file: File): Observable<HttpEvent<EditorResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient.post<EditorResponse>(`${this.env.API_URL_ADMIN}/editor/imagen-temp`, formData, {
      reportProgress: true,
      observe: 'events'
    })
    .pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error.error?.detail ?? error?.message ?? 'Error al agregar la imagen.'))
    );
  }
}
