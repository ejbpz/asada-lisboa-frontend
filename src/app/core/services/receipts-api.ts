import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';
import { ReceiptResponse } from '@public/interfaces/receipt-respose.interface';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReceiptsApi {
  // Init
  private env = environment;

  // Injection
  private httpClient = inject(HttpClient);

  // Http calls
  public getReceipt(receiptNumber: number): Observable<ReceiptResponse> {
    return this.httpClient.get<ReceiptResponse>(`${this.env.API_URL_CLIENT}/recibos/${receiptNumber}`)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener el recibo.')))
      );
  }
}
