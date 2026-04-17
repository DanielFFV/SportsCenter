import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CorredorGrupoResponse } from 'src/app/models/corredorGrupo';
import { PaginatedResponse } from 'src/app/models/PaginatedResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CorredorGrupoService {
  private baseUrl = environment.baseUrl+"/corredorGrupo";

  constructor( private http: HttpClient) { }

  getMiembrosGrupo(idGrupo: string): Observable<PaginatedResponse<CorredorGrupoResponse>> {
    return this.http.get<PaginatedResponse<CorredorGrupoResponse>>(`${this.baseUrl}/grupo/${idGrupo}`);
  }

  getCapitan(idGrupo: string): Observable<CorredorGrupoResponse>{
    return this.http.get<CorredorGrupoResponse>(`${this.baseUrl}/grupoCapitan/${idGrupo}`);
  }

}
