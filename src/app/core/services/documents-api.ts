import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  // Http calls
  public getPublicDocuments(params: HttpParams): Observable<PageResponse<DocumentMinimalResponse>> {
    return this.httpClient.get<PageResponse<DocumentMinimalResponse>>(`${this.env.API_URL_CLIENT}/documentos`, { params });
  }
}
