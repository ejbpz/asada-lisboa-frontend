import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { PrincipalRequest } from '@public/interfaces/principal-response.interface';

@Injectable({
  providedIn: 'root'
})
export class PrincipalApi {
  // Init
  private env = environment;

  // Injects
  private httpClient = inject(HttpClient);

  // Http public calls
  public getPrincipalInformation(): Observable<PrincipalRequest> {
    return this.httpClient.get<PrincipalRequest>(`${this.env.API_URL_CLIENT}/principal`);
  }

  // Http admin calls
  public getPrincipalAdminInformation(): Observable<PrincipalRequest> {
    return this.httpClient.get<PrincipalRequest>(`${this.env.API_URL_ADMIN}/principal`);
  }
}
