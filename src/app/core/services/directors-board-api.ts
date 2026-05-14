import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { PageResponse } from '@shared/interfaces/page-response.interface';
import { RegisterRequest } from '@admin/interfaces/register-request.interface';
import { DirectorsBoardResponse } from '@public/interfaces/directors-board-response.interface';
import { UserUpdateRequest } from '@admin/interfaces/user-update-request.interface';
import { DirectorBoardDetailsResponse } from '@admin/interfaces/director-board-details-response.interface';

@Injectable({
  providedIn: 'root'
})
export class DirectorsBoardApi {
   // Init
  private env = environment;

  // Inject
  private httpClient = inject(HttpClient);

  // Http calls - public
  public getDirectorsBoardInformation(): Observable<DirectorsBoardResponse[]> {
    return this.httpClient.get<DirectorsBoardResponse[]>(`${this.env.API_URL_CLIENT}/usuarios`).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener la junta directiva.')))
    );
  }

  // Http calls - admin
  public getAdminUsers(params: HttpParams): Observable<PageResponse<DirectorsBoardResponse>> {
    return this.httpClient.get<PageResponse<DirectorsBoardResponse>>(`${this.env.API_URL_ADMIN}/usuarios`, { params })
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => error.error?.detail ?? error?.message ?? 'Error inesperado al obtener los usuarios.'))
      );
  }

  public getAdminUser(id: string): Observable<DirectorBoardDetailsResponse> {
    return this.httpClient.get<DirectorBoardDetailsResponse>(`${this.env.API_URL_ADMIN}/usuarios/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => error.error?.detail ?? error?.message ?? 'Error inesperado al obtener los usuarios.'))
      );
  }

  public deleteUser(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.env.API_URL_ADMIN}/usuarios/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => error.error?.detail ?? error?.message ?? 'Error inesperado al eliminar al usuario.'))
      );
  }

  public createUser(registerRequest: RegisterRequest): Observable<void> {
    return this.httpClient.post<void>(`${this.env.API_URL_ACCOUNT}/registrar`, {
      email: registerRequest.email,
      roleId: registerRequest.roleId,
      chargeId: registerRequest.chargeId,
      password: registerRequest.password,
      firstName: registerRequest.firstName,
      phoneNumber: registerRequest.phoneNumber,
      firstLastName: registerRequest.firstLastName,
      secondLastName: registerRequest.secondLastName,
      confirmPassword: registerRequest.confirmPassword,
    }).pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al crear un usuario.')))
      );
  }

  public updateUser(id: string, registerRequest: UserUpdateRequest): Observable<void> {
    return this.httpClient.put<void>(`${this.env.API_URL_ADMIN}/usuarios/${id}`, {
      roleId: registerRequest.roleId,
      chargeId: registerRequest.chargeId,
      firstName: registerRequest.firstName,
      phoneNumber: registerRequest.phoneNumber,
      firstLastName: registerRequest.firstLastName,
      secondLastName: registerRequest.secondLastName,
    }).pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al actualizar un usuario.')))
      );
  }
}
