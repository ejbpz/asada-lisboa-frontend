import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
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
    return this.httpClient.post<ReceiptResponse>(`${this.env.API_URL_CLIENT}/recibos/${receiptNumber}`, {});
  }

  public getReceiptDetails(receiptRequest: ReceiptRequest): Observable<ReceiptDetailsResponse> {
    return this.httpClient.post<ReceiptDetailsResponse>(`${this.env.API_URL_CLIENT}/recibos`, {
      receiptNumber: receiptRequest.receiptNumber,
      index: receiptRequest.index,
    });
  }
}
