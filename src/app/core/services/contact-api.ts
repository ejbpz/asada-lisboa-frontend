import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { PageResponse } from '@shared/interfaces/page-response.interface';
import { ContactRequest } from '@admin/interfaces/contact-request.interface';
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

  // Http public calls
  public getContactInformation(): Observable<ContactResponse[]> {
    return this.httpClient.get<PageResponse<ContactResponse>>(`${this.env.API_URL_CLIENT}/contactos`)
      .pipe(
        map((response: PageResponse<ContactResponse>) => response.data),
      );
  }

  public contactEmail(emailContactRequest: EmailContactRequest): Observable<void> {
    return this.httpClient.post<void>(`${this.env.API_URL_ACCOUNT}/email`, {
      email: emailContactRequest.email,
      subject: emailContactRequest.subject,
      message: emailContactRequest.message,
      fullName: emailContactRequest.fullName,
      phoneNumber: emailContactRequest.phoneNumber,
    });
  }

  public recaptchaValidation(reCaptchdaRequest: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.env.API_URL_ACCOUNT}/email/re-captcha`, {
      reCaptchaRequest: reCaptchdaRequest,
    });
  }

  // Http admin calls
  public getAdminContacts(): Observable<ContactResponse[]> {
    const params = new HttpParams()
      .append('take', 100)
      .append('offset', 0)
      .append('search', '')
      .append('filterBy', '')
      .append('sortBy', 'order')
      .append('sortDirection', 'asc')

    return this.httpClient.get<PageResponse<ContactResponse>>(`${this.env.API_URL_ADMIN}/contactos`, { params })
      .pipe(
        map((response: PageResponse<ContactResponse>) => response.data),
      );
  }

  public createOrEditContact(contactRequest: ContactRequest, id: string | undefined = undefined): Observable<ContactResponse> {
    if(id !== null && id !== undefined) {
      return this.httpClient.put<ContactResponse>(`${this.env.API_URL_ADMIN}/contactos/${id}`, {
        order: contactRequest.order,
        value: contactRequest.value,
        contactType: contactRequest.contactType,
      });
    }

    return this.httpClient.post<ContactResponse>(`${this.env.API_URL_ADMIN}/contactos`, {
        order: contactRequest.order,
        value: contactRequest.value,
        contactType: contactRequest.contactType,
      });
  }

  public deleteContact(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.env.API_URL_ADMIN}/contactos/${id}`);
  }
}
