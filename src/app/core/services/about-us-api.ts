import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { PageResponse } from '@shared/interfaces/page-response.interface';
import { AboutUsRequest } from '@admin/interfaces/about-us-request.interface';
import { AboutUsResponse} from '@public/interfaces/about-us-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AboutUsApi {
  // Init
  private env = environment;

  // Inject
  private httpClient = inject(HttpClient);

  // Http public calls
  public getAboutUsInformation(): Observable<AboutUsResponse[]> {
    return this.httpClient.get<PageResponse<AboutUsResponse>>(`${this.env.API_URL_CLIENT}/nosotros`)
      .pipe(
        map((response: PageResponse<AboutUsResponse>) => response.data)
      );
  }

  // Http admin calls
  public getAdminAboutUs(): Observable<AboutUsResponse[]> {
    const params = new HttpParams()
      .append('take', 100)
      .append('offset', 0)
      .append('search', '')
      .append('filterBy', '')
      .append('sortBy', 'order')
      .append('sortDirection', 'asc')

    return this.httpClient.get<PageResponse<AboutUsResponse>>(`${this.env.API_URL_ADMIN}/nosotros`, { params })
      .pipe(
        map((response: PageResponse<AboutUsResponse>) => response.data),
      );
  }

  public createOrEditAboutUs(aboutUsRequest: AboutUsRequest, id: string | undefined = undefined): Observable<AboutUsResponse> {
    if(id !== null && id !== undefined) {
      return this.httpClient.put<AboutUsResponse>(`${this.env.API_URL_ADMIN}/nosotros/${id}`, {
        order: aboutUsRequest.order,
        content: aboutUsRequest.content,
        sectionType: aboutUsRequest.sectionType,
      });
    }

    return this.httpClient.post<AboutUsResponse>(`${this.env.API_URL_ADMIN}/nosotros`, {
      order: aboutUsRequest.order,
      content: aboutUsRequest.content,
      sectionType: aboutUsRequest.sectionType,
    });
  }

  public deleteAboutUs(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.env.API_URL_ADMIN}/nosotros/${id}`);
  }
}
