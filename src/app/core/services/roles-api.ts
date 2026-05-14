import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { RoleResponse } from '@admin/interfaces/role-response.interface';

@Injectable({
  providedIn: 'root'
})
export class RolesApi {
  // Init
  private env = environment;

  // Inject
  private httpClient = inject(HttpClient);

  // HttpCalls
  public getRoles(): Observable<RoleResponse[]> {
    return this.httpClient.get<RoleResponse[]>(`${this.env.API_URL_ADMIN}/roles`)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => error.error?.detail ?? error?.message ?? 'Error al obtener los roles.'))
      );
  }
}
