import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CorredorService } from './corredor.service';
import { environment } from 'src/environments/environment';
import { CorredorRequest, CorredorResponse } from '../../models/corredor';

describe('CorredorService', () => {
  let service: CorredorService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.baseUrl + "/corredor";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CorredorService]
    });

    service = TestBed.inject(CorredorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no haya solicitudes HTTP pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch corredores with pagination', () => {
    const mockCorredores: CorredorResponse[] = [
      {
        id: '1',
        persona: {
          id: 'p1',
          nombre: 'Juan',
          apellido: 'Pérez',
          documento: '12345678',
          tipoDocumento: {id: '1', nombre: 'Cédula'},
          email: `${('Juan').toLowerCase()}@example.com`,
          estado: true,
          fechaNacimiento: '1990-01-01',
          celular: '3101234567',
          direccion: 'Calle Falsa 123',
          genero: 'M',
          tallaCamiseta: 'M',
          eps: 'EPS Test',
          rh: 'O+',
          fechaCreacion: new Date().toISOString(),
          fechaModificacion: new Date().toISOString()
        },
        dorsal: 10,
        estado: true,
        fechaCreacion: '2024-01-01',
        fechaModificacion: '2024-01-02'
      }
    ];

    service.getCorredores(0, 10).subscribe(corredores => {
      expect(corredores.length).toBe(1);
      expect(corredores[0].id).toBe('1');
    });

    const req = httpMock.expectOne(`${baseUrl}?page=0&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCorredores);
  });

  it('should fetch corredor by ID', () => {
    const mockCorredor: CorredorResponse = {
      id: '1',
      persona: {
        id: 'p1',
        nombre: 'Juan',
        apellido: 'Pérez',
        documento: '12345678',
        tipoDocumento: {id: '1', nombre: 'Cédula'},
        email: `${('Juan').toLowerCase()}@example.com`,
        estado: true,
        fechaNacimiento: '1990-01-01',
        celular: '3101234567',
        direccion: 'Calle Falsa 123',
        genero: 'M',
        tallaCamiseta: 'M',
        eps: 'EPS Test',
        rh: 'O+',
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString()
      },
      dorsal: 10,
      estado: true,
      fechaCreacion: '2024-01-01',
      fechaModificacion: '2024-01-02'
    };

    service.getCorredorById('1').subscribe(corredor => {
      expect(corredor.id).toBe('1');
      expect(corredor.dorsal).toBe(10);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCorredor);
  });

  it('should fetch corredor by documento', () => {
    const mockCorredor: CorredorResponse = {
      id: '1',
      persona: {
        id: 'p1',
        nombre: 'Juan',
        apellido: 'Pérez',
        documento: '12345678',
        tipoDocumento: {id: '1', nombre: 'Cédula'},
        email: `${('Juan').toLowerCase()}@example.com`,
        estado: true,
        fechaNacimiento: '1990-01-01',
        celular: '3101234567',
        direccion: 'Calle Falsa 123',
        genero: 'M',
        tallaCamiseta: 'M',
        eps: 'EPS Test',
        rh: 'O+',
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString()
      },
      dorsal: 10,
      estado: true,
      fechaCreacion: '2024-01-01',
      fechaModificacion: '2024-01-02'
    };

    service.getCorredorByDocumento('12345678').subscribe(corredor => {
      expect(corredor.persona.documento).toBe('12345678');
    });

    const req = httpMock.expectOne(`${baseUrl}/persona/documento/12345678`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCorredor);
  });

  it('should fetch corredor by persona ID', () => {
    const mockCorredor: CorredorResponse = {
      id: '1',
      persona: {
        id: 'p1',
        nombre: 'Juan',
        apellido: 'Pérez',
        documento: '12345678',
        tipoDocumento: {id: '1', nombre: 'Cédula'},
        email: `${('Juan').toLowerCase()}@example.com`,
        estado: true,
        fechaNacimiento: '1990-01-01',
        celular: '3101234567',
        direccion: 'Calle Falsa 123',
        genero: 'M',
        tallaCamiseta: 'M',
        eps: 'EPS Test',
        rh: 'O+',
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString()
      },
      dorsal: 10,
      estado: true,
      fechaCreacion: '2024-01-01',
      fechaModificacion: '2024-01-02'
    };

    service.getCorredorByPersonaId('p1').subscribe(corredor => {
      expect(corredor.persona.id).toBe('p1');
    });

    const req = httpMock.expectOne(`${baseUrl}/persona/p1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCorredor);
  });

  it('should create a new corredor', () => {
    const newCorredorRequest: CorredorRequest = {
      personaId: 'p1',
      corredorResponsableId: 'resp1'
    };

    const mockCorredorResponse: CorredorResponse = {
      id: '2',
      persona: {
        id: 'p1',
        nombre: 'Juan',
        apellido: 'Pérez',
        documento: '1234567890',
        tipoDocumento: {id: '1', nombre: 'Cédula'},
        email: `${('Juan').toLowerCase()}@example.com`,
        estado: true,
        fechaNacimiento: '1990-01-01',
        celular: '3101234567',
        direccion: 'Calle Falsa 123',
        genero: 'M',
        tallaCamiseta: 'M',
        eps: 'EPS Test',
        rh: 'O+',
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString()
      },
      dorsal: 11,
      estado: true,
      fechaCreacion: '2024-02-01',
      fechaModificacion: '2024-02-01'
    };

    service.createCorredor(newCorredorRequest).subscribe(corredor => {
      expect(corredor.id).toBe('2');
      expect(corredor.persona.id).toBe('p1');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCorredorRequest);
    req.flush(mockCorredorResponse);
  });
});