import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';
import { PageResponse } from '@public/interfaces/page-response.interface';
import { DocumentMinimalResponse } from '@public/interfaces/document-minimal-response.interface';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentsApi {
  // Init
  private env = environment;

  // Injections
  private httpClient = inject(HttpClient);

  // Http calls
  public getPublicDocuments(): Observable<PageResponse<DocumentMinimalResponse>> {
    return this.httpClient.get<PageResponse<DocumentMinimalResponse>>(`${this.env.API_URL_CLIENT}/documentos`);
  }
}
