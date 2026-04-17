import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistroCarreraRequest, RegistroCarreraResponse, RegistroCarreraResponseCreateGrupo } from 'src/app/models/registroCarrera';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistroCarreraService {
  private baseUrl = environment.baseUrl+'/registroCarrera';

  constructor( private http: HttpClient) { }

  registrarse(registroCarrera:RegistroCarreraRequest): Observable<RegistroCarreraResponse> {
    console.log(registroCarrera);
    return this.http.post<RegistroCarreraResponse>(`${this.baseUrl}`, registroCarrera);
  }

  registrarGrupo(registroCarrera:RegistroCarreraRequest): Observable<RegistroCarreraResponseCreateGrupo> {
    return this.http.post<RegistroCarreraResponseCreateGrupo>(`${this.baseUrl}/grupo`, registroCarrera);
  }

  getByCorredor(corredor: string): Observable<RegistroCarreraResponse[]> {
    return this.http.get<RegistroCarreraResponse[]>(`${this.baseUrl}/corredor/${corredor}`);
  }

  getCarrerasActivas(corredor: string, page: number, size: number): Observable<RegistroCarreraResponse> {
    return this.http.get<RegistroCarreraResponse>(`${this.baseUrl}/corredorFechaCarreraEstado/${corredor}`, {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    });
  }

  salirCarrera(idRegistro: string): Observable<RegistroCarreraResponse> {
    return this.http.put<RegistroCarreraResponse>(`${this.baseUrl}/inactivarCarrera/${idRegistro}`, {});
  }

}
