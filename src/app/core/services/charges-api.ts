import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { ChargeResponse } from '@admin/interfaces/charge-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ChargesApi {
  // Init
  private env = environment;

  // Inject
  private httpClient = inject(HttpClient);

  // HttpCalls
  public getCharges(): Observable<ChargeResponse[]> {
    return this.httpClient.get<ChargeResponse[]>(`${this.env.API_URL_ADMIN}/cargos`);
  }
}
