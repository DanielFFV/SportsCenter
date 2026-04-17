import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from 'src/app/models/login';
import { PersonaResponse } from 'src/app/models/persona';
import { environment } from 'src/environments/environment';
import { LoginRequest } from '../../models/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = environment.baseUrl+'/login';

  constructor( private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}`, loginRequest);
  }
}
 