import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  private documentPath = 'assets/documents/legal';

  getTerminosCondiciones(): SafeResourceUrl {
    const url = `${this.documentPath}/terminos-condiciones.pdf`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getPoliticaDatos(): SafeResourceUrl {
    const url = `${this.documentPath}/politica-datos.pdf`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  constructor(private sanitizer: DomSanitizer) {}
}
