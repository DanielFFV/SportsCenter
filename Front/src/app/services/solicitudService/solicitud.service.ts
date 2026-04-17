import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from 'src/app/models/PaginatedResponse';
import { CreateSolicitudGrupo, SolicitudGrupo } from 'src/app/models/solicitudGrupo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private baseUrl = environment.baseUrl+"/solicitudGrupo";

  constructor( private http: HttpClient) { }

  getPeticionesPendientesCapitan(grupoId: string, page: number, size: number): Observable<PaginatedResponse<SolicitudGrupo>> {
    return this.http.get<PaginatedResponse<SolicitudGrupo>>(`${this.baseUrl}/grupoEstadoSolicitud/${grupoId}`, {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    });
  }

  getPeticionesByCorredor(corredorId: string): Observable<PaginatedResponse<SolicitudGrupo>> {
    return this.http.get<PaginatedResponse<SolicitudGrupo>>(`${this.baseUrl}/corredor/${corredorId}`, {});
  }

  negarPeticion(solicitudId:string): Observable<SolicitudGrupo>{
    return this.http.put<SolicitudGrupo>(`${this.baseUrl}/denegar/${solicitudId}`,null );
  }

  afirmarPeticion(solicitudId:string): Observable<SolicitudGrupo>{
    return this.http.put<SolicitudGrupo>(`${this.baseUrl}/afirmar/${solicitudId}`,null );
  }
  
  saveSolicitudGrupo(createSolicitudGrupoDto: CreateSolicitudGrupo): Observable<SolicitudGrupo> {
    return this.http.post<SolicitudGrupo>(`${this.baseUrl}`, createSolicitudGrupoDto);
  }
}
