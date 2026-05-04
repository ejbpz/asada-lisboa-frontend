import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { PageResponse } from '@shared/interfaces/page-response.interface';
import { ContactResponse } from '@public/interfaces/contact-response.interface';
import { EmailContactRequest } from '@public/interfaces/email-contact-request.interface';

@Injectable({
  providedIn: 'root'
})
export class ContactApi {
  // Init
  private env = environment;

  // Inject
  private httpClient = inject(HttpClient);

  // Http calls
  public getContactInformation(): Observable<ContactResponse[]> {
    return this.httpClient.get<PageResponse<ContactResponse>>(`${this.env.API_URL_CLIENT}/contactos`)
      .pipe(
        map((response: PageResponse<ContactResponse>) => response.data),
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener información de contacto.')))
      );
  }

  public contactEmail(emailContactRequest: EmailContactRequest): Observable<void> {
    return this.httpClient.post<void>(`${this.env.API_URL_ACCOUNT}/email`, {
      email: emailContactRequest.email,
      subject: emailContactRequest.subject,
      message: emailContactRequest.message,
      fullName: emailContactRequest.fullName,
      phoneNumber: emailContactRequest.phoneNumber,
    }).pipe(
        catchError((error: HttpErrorResponse) => throwError(() => error.error?.detail ?? error?.message ?? 'Error inesperado al enviar mensaje de contacto.'))
      );
  }

  public recaptchaValidation(reCaptchdaRequest: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.env.API_URL_ACCOUNT}/email/re-captcha`, {
      reCaptchaRequest: reCaptchdaRequest,
    }).pipe(
        catchError(() => throwError(() => new Error('Error al validar el ReCAPTCHA.')))
      );
  }
}
