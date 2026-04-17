import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CarreraResponse, CreateCarreraRequest } from '../../models/carrera';
@Injectable({
  providedIn: 'root'
})
export class CarreraService {
  private baseUrl = environment.baseUrl+"/carrera";

  constructor( private http: HttpClient) { }

  getCarreras(page: number, size: number): Observable<CarreraResponse[]> {
    return this.http.get<CarreraResponse[]>(`${this.baseUrl}`, {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    });
  }

  getCarrerasVigentes(page: number, size: number): Observable<CarreraResponse[]> {
    return this.http.get<CarreraResponse[]>(`${this.baseUrl}/estado`, {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    });
  }

  createCarrera(carrera: CreateCarreraRequest): Observable<CarreraResponse> {
    return this.http.post<CarreraResponse>(`${this.baseUrl}`, carrera);
  }
}
