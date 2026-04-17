import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EpsResponse } from 'src/app/models/eps';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EpsService {
  private baseUrl = environment.baseUrl + "/eps";

  constructor(private http: HttpClient) { }

  getAllRecords(page: number = 0, size: number = 30): Observable<EpsResponse[]> {
    return this.http.get<any>(`${this.baseUrl}?page=${page}&size=${size}`).pipe(
      map(response => response.content || response)
    );
  }

  // Método opcional si necesitas paginación
  getEpsPaginado(page: number = 0, size: number = 10): Observable<EpsResponse[]> {
    return this.http.get<any>(`${this.baseUrl}?page=${page}&size=${size}`).pipe(
      map(response => response.content || response)
    );
  }
}