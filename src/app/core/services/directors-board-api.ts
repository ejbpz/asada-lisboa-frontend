import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { DirectorsBoardResponse } from '@public/interfaces/directors-board-response.interface';

@Injectable({
  providedIn: 'root'
})
export class DirectorsBoardApi {
   // Init
  private env = environment;

  // Inject
  private httpClient = inject(HttpClient);

  public getDirectorsBoardInformation(): Observable<DirectorsBoardResponse[]> {
    return this.httpClient.get<DirectorsBoardResponse[]>(`${this.env.API_URL_CLIENT}/usuarios`);
  }
}
