import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { PageResponse } from '@shared/interfaces/page-response.interface';
import { RegisterRequest } from '@admin/interfaces/register-request.interface';
import { UserUpdateRequest } from '@admin/interfaces/user-update-request.interface';
import { DirectorsBoardResponse } from '@public/interfaces/directors-board-response.interface';
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
    return this.httpClient.get<DirectorsBoardResponse[]>(`${this.env.API_URL_CLIENT}/usuarios`);
  }

  // Http calls - admin
  public getAdminUsers(params: HttpParams): Observable<PageResponse<DirectorsBoardResponse>> {
    return this.httpClient.get<PageResponse<DirectorsBoardResponse>>(`${this.env.API_URL_ADMIN}/usuarios`, { params });
  }

  public getAdminUser(id: string): Observable<DirectorBoardDetailsResponse> {
    return this.httpClient.get<DirectorBoardDetailsResponse>(`${this.env.API_URL_ADMIN}/usuarios/${id}`);
  }

  public deleteUser(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.env.API_URL_ADMIN}/usuarios/${id}`);
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
    });
  }

  public updateUser(id: string, registerRequest: UserUpdateRequest): Observable<void> {
    return this.httpClient.put<void>(`${this.env.API_URL_ADMIN}/usuarios/${id}`, {
      roleId: registerRequest.roleId,
      chargeId: registerRequest.chargeId,
      firstName: registerRequest.firstName,
      phoneNumber: registerRequest.phoneNumber,
      firstLastName: registerRequest.firstLastName,
      secondLastName: registerRequest.secondLastName,
    });
  }
}
