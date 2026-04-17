import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GrupoService } from './grupo.service';
import { CreateGrupoRequest, GrupoResponse } from 'src/app/models/grupo';
import { environment } from 'src/environments/environment';

describe('GrupoService', () => {
  let service: GrupoService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.baseUrl + "/grupo";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GrupoService]
    });

    service = TestBed.inject(GrupoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no haya solicitudes HTTP pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch grupos with pagination', () => {
    const mockGruposResponse: GrupoResponse = {
      id: '1',
      nombre: 'Grupo Ejemplo',
      cantidadCorredor: 10,
      estado: true,
      fechaCreacion: '2024-01-01T00:00:00',
      fechaModificacion: '2024-01-02T00:00:00'
    };

    service.getGrupo(0, 10).subscribe(grupo => {
      expect(grupo.id).toBe('1');
      expect(grupo.nombre).toBe('Grupo Ejemplo');
      expect(grupo.cantidadCorredor).toBe(10);
    });

    const req = httpMock.expectOne(`${baseUrl}?page=0&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockGruposResponse);
  });

  it('should create a new grupo', () => {
    const newGrupoRequest: CreateGrupoRequest = {
      nombre: 'Nuevo Grupo',
      cantidadCorredor: 5,
      corredorCreador: 'corredor1',
      fechaCreacion: new Date('2024-01-01')
    };

    const mockGrupoResponse: GrupoResponse = {
      id: '2',
      nombre: 'Nuevo Grupo',
      cantidadCorredor: 5,
      estado: true,
      fechaCreacion: '2024-01-01T00:00:00',
      fechaModificacion: '2024-01-01T00:00:00'
    };

    service.postGrupo(newGrupoRequest).subscribe(grupo => {
      expect(grupo.id).toBe('2');
      expect(grupo.nombre).toBe('Nuevo Grupo');
      expect(grupo.cantidadCorredor).toBe(5);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newGrupoRequest);
    req.flush(mockGrupoResponse);
  });

  it('should find grupo by name', () => {
    const mockGrupoResponse: GrupoResponse = {
      id: '3',
      nombre: 'Grupo Buscado',
      cantidadCorredor: 7,
      estado: true,
      fechaCreacion: '2024-02-01T00:00:00',
      fechaModificacion: '2024-02-02T00:00:00'
    };

    service.findByName('Grupo Buscado').subscribe(grupo => {
      expect(grupo.id).toBe('3');
      expect(grupo.nombre).toBe('Grupo Buscado');
    });

    const req = httpMock.expectOne(`${baseUrl}/nombre/Grupo Buscado`);
    expect(req.request.method).toBe('GET');
    req.flush(mockGrupoResponse);
  });

  it('should handle grupo creation with minimal data', () => {
    const minimalGrupoRequest: CreateGrupoRequest = {
      nombre: 'Grupo Mínimo',
      cantidadCorredor: 0,
      corredorCreador: 'corredor2',
      fechaCreacion: new Date()
    };

    const mockGrupoResponse: GrupoResponse = {
      id: '4',
      nombre: 'Grupo Mínimo',
      cantidadCorredor: 0,
      estado: true,
      fechaCreacion: new Date().toISOString(),
      fechaModificacion: new Date().toISOString()
    };

    service.postGrupo(minimalGrupoRequest).subscribe(grupo => {
      expect(grupo.nombre).toBe('Grupo Mínimo');
      expect(grupo.cantidadCorredor).toBe(0);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockGrupoResponse);
  });
});