import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePersonaRequest, PersonaResponse } from 'src/app/models/persona';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private baseUrl = environment.baseUrl+'/persona';

  constructor( private http: HttpClient) { }

  getPersona(page: number, size: number): Observable<PersonaResponse[]> {
    return this.http.get<PersonaResponse[]>(`${this.baseUrl}`, {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    });
  }

  createPersona(persona: CreatePersonaRequest): Observable<PersonaResponse> {
    return this.http.post<PersonaResponse>(`${this.baseUrl}`, persona);
  }
}
