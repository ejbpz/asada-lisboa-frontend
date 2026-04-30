import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { CategoriesResponse } from '@shared/interfaces/categories-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesApi {
  // Init
  private env = environment;

  // Inject
  private httpClient = inject(HttpClient);

  // HttpCalls
  public searchCategories(query: string): Observable<CategoriesResponse[]> {
    const params = new HttpParams()
      .set('search', query)

    return this.httpClient.get<CategoriesResponse[]>(`${this.env.API_URL_ADMIN}/categorias/buscar`, { params: params })
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => error.error?.detail ?? error?.message ?? 'Error al obtener las categorías.'))
      );
  }
}
