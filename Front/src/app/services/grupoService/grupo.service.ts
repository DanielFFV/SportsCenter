import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateGrupoRequest, GrupoResponse } from 'src/app/models/grupo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  private baseUrl = environment.baseUrl+"/grupo";

  constructor( private http: HttpClient) { }

  getGrupo(page: number, size: number): Observable<GrupoResponse> {
    return this.http.get<GrupoResponse>(`${this.baseUrl}`, {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    });
  }

  postGrupo(grupo: CreateGrupoRequest): Observable<GrupoResponse> {
    return this.http.post<GrupoResponse>(`${this.baseUrl}`, grupo);
  }
  
  findByName(nombre: string): Observable<GrupoResponse> {
    return this.http.get<GrupoResponse>(`${this.baseUrl}/nombre/${nombre}`);
  }

}
