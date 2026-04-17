import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TipoDocService } from './tipo-doc.service';
import { TipoDocumentoResponse } from 'src/app/models/TipoDocumento';
import { environment } from 'src/environments/environment';

describe('TipoDocService', () => {
  let service: TipoDocService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.baseUrl + "/tipoDocumento";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoDocService]
    });

    service = TestBed.inject(TipoDocService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no haya solicitudes HTTP pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all tipo documentos', () => {
    const mockTipoDocumentos: TipoDocumentoResponse[] = [
      { id: '1', nombre: 'Cédula de Ciudadanía' },
      { id: '2', nombre: 'Pasaporte' },
      { id: '3', nombre: 'Tarjeta de Identidad' }
    ];

    service.getTipoDocumentos().subscribe(tipoDocumentos => {
      expect(tipoDocumentos.length).toBe(3);
      expect(tipoDocumentos[0].nombre).toBe('Cédula de Ciudadanía');
      expect(tipoDocumentos[1].id).toBe('2');
      expect(tipoDocumentos[2].nombre).toBe('Tarjeta de Identidad');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTipoDocumentos);
  });

  it('should handle empty list of tipo documentos', () => {
    service.getTipoDocumentos().subscribe(tipoDocumentos => {
      expect(tipoDocumentos.length).toBe(0);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should return tipo documentos with correct structure', () => {
    const mockTipoDocumentos: TipoDocumentoResponse[] = [
      { id: '4', nombre: 'Registro Civil' }
    ];

    service.getTipoDocumentos().subscribe(tipoDocumentos => {
      expect(tipoDocumentos[0]).toEqual(jasmine.objectContaining({
        id: jasmine.any(String),
        nombre: jasmine.any(String)
      }));
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTipoDocumentos);
  });

  it('should use the correct base URL', () => {
    service.getTipoDocumentos().subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.url).toBe(baseUrl);
  });
});