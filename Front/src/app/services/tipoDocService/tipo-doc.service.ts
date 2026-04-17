import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoDocumentoResponse } from 'src/app/models/TipoDocumento';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoDocService {

  private baseUrl = environment.baseUrl+"/tipoDocumento";

  constructor( private http: HttpClient) { }

  getTipoDocumentos(): Observable<TipoDocumentoResponse[]> {
    return this.http.get<TipoDocumentoResponse[]>(`${this.baseUrl}`);
  }
}
