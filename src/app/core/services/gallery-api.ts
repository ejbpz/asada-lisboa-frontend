import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { ImageRequest } from '@admin/interfaces/image-request.interface';
import { PageResponse } from '@shared/interfaces/page-response.interface';
import { ImageResponse } from '@admin/interfaces/image-response.interface';
import { ImageMinimalResponse } from '@public/interfaces/image-minimal-response.interface';

@Injectable({
  providedIn: 'root'
})
export class GalleryApi {
  // Init
  private env = environment;

  // Injection
  private httpClient = inject(HttpClient);

  // Http public calls
  public getPublicImages(params: HttpParams): Observable<PageResponse<ImageMinimalResponse>> {
    return this.httpClient.get<PageResponse<ImageMinimalResponse>>(`${this.env.API_URL_CLIENT}/imagenes`, { params });
  }

  // Http admin calls
  public getAdminImages(params: HttpParams): Observable<PageResponse<ImageResponse>> {
    return this.httpClient.get<PageResponse<ImageResponse>>(`${this.env.API_URL_ADMIN}/imagenes`, { params });
  }

  public getAdminImage(id: string): Observable<ImageResponse> {
    return this.httpClient.get<ImageResponse>(`${this.env.API_URL_ADMIN}/imagenes/${id}`);
  }

  public deleteImage(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.env.API_URL_ADMIN}/imagenes/${id}`);
  }

  public createOrEditImage(newRequest: ImageRequest, id: string | undefined = undefined): Observable<ImageResponse> {
    const formData = new FormData();

    formData.append('title', newRequest.title);

    if(newRequest.file)
      formData.append('file', newRequest.file);

    formData.append('statusId', newRequest.statusId);
    formData.append('description', newRequest.description);

    newRequest.categories.forEach((cat: any, index: number) => {
      if (cat.id !== null && cat.id !== undefined)
        formData.append(`categories[${index}].id`, cat.id);

      formData.append(`categories[${index}].name`, cat.name);
    });

    if(id !== null && id !== undefined) {
      return this.httpClient.put<ImageResponse>(`${this.env.API_URL_ADMIN}/imagenes/${id}`, formData);
    }

    return this.httpClient.post<ImageResponse>(`${this.env.API_URL_ADMIN}/imagenes`, formData);
  }
}
