import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
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
    return this.httpClient.get<ChargeResponse[]>(`${this.env.API_URL_ADMIN}/cargos`)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => error.error?.detail ?? error?.message ?? 'Error al obtener los cargos.'))
      );
  }
}
