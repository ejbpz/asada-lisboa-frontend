import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { ReceiptRequest } from '@public/interfaces/receipt-request.interface';
import { ReceiptResponse } from '@public/interfaces/receipt-respose.interface';
import { ReceiptDetailsResponse } from '@public/interfaces/receipt-details-response.interface';

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
    return this.httpClient.post<ReceiptResponse>(`${this.env.API_URL_CLIENT}/recibos/${receiptNumber}`, {})
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener el recibo.')))
      );
  }

  public getReceiptDetails(receiptRequest: ReceiptRequest): Observable<ReceiptDetailsResponse> {
    return this.httpClient.post<ReceiptDetailsResponse>(`${this.env.API_URL_CLIENT}/recibos`, {
      receiptNumber: receiptRequest.receiptNumber,
      index: receiptRequest.index,
    })
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener el detalle del recibo.')))
      );
  }
}
