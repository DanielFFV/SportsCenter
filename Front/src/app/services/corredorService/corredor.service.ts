import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CorredorRequest, CorredorResponse } from '../../models/corredor';
@Injectable({
  providedIn: 'root'
})
export class CorredorService {
  private baseUrl = environment.baseUrl+"/corredor";
  
  constructor( private http: HttpClient) { }

  getCorredores(page: number, size: number): Observable<CorredorResponse[]> {
    return this.http.get<CorredorResponse[]>(`${this.baseUrl}`, {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    });
  }

  getCorredorById(Id: string): Observable<CorredorResponse> {
    return this.http.get<CorredorResponse>(`${this.baseUrl}/${Id}`, {
    });  
  }

  getCorredorByDocumento(documento: string): Observable<CorredorResponse> {
    return this.http.get<CorredorResponse>(`${this.baseUrl}/persona/documento/${documento}`, {

    });  
  }

  getCorredorByPersonaId(Id: string): Observable<CorredorResponse> {
    return this.http.get<CorredorResponse>(`${this.baseUrl}/persona/${Id}`, {
    });  
  }

  // getByCorredor(corredor: string): Observable<RegistroCarreraResponse[]> {
  //   return this.http.get<RegistroCarreraResponse[]>(`${this.baseUrl}/corredor/${corredor}`);
  // }

  createCorredor(corredor: CorredorRequest): Observable<CorredorResponse> {
    return this.http.post<CorredorResponse>(`${this.baseUrl}`, corredor);
  }
}
