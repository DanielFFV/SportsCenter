import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PersonaService } from './persona.service';
import { environment } from 'src/environments/environment';
import { CreatePersonaRequest, PersonaResponse } from 'src/app/models/persona';

describe('PersonaService', () => {
  let service: PersonaService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.baseUrl + '/persona';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PersonaService]
    });

    service = TestBed.inject(PersonaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve personas with pagination', () => {
    const mockPersonas: PersonaResponse[] = [
      {
        id: '1',
        nombre: 'Juan',
        apellido: 'Pérez',
        documento: '12345',
        tipoDocumento: { id: '1', nombre: 'Cédula' },
        email: 'juan@example.com',
        estado: true,
        fechaNacimiento: '1990-01-01',
        celular: '3101234567',
        direccion: 'Calle Falsa 123',
        genero: 'M',
        tallaCamiseta: 'M',
        eps: 'EPS Test',
        rh: 'O+',
        fechaCreacion: '2024-01-01',
        fechaModificacion: '2024-01-01'
      }
    ];

    service.getPersona(0, 10).subscribe(response => {
      expect(response).toEqual(mockPersonas);
    });

    const req = httpMock.expectOne(`${baseUrl}?page=0&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPersonas);
  });

  it('should create a new persona', () => {
    const newPersona: CreatePersonaRequest = {
      nombre: 'María',
      apellido: 'González',
      documento: '67890',
      tipoDocumento: { id: '1', nombre: 'Cédula' },
      email: 'maria@example.com',
      fechaNacimiento: new Date('1995-05-05'),
      celular: '3209876543',
      direccion: 'Avenida Siempre Viva 742',
      genero: 'F',
      tallaCamiseta: 'L',
      eps: 'EPS Ejemplo',
      rh: 'A+'
    };

    const expectedResponse: PersonaResponse = {
      ...newPersona,
      id: '2',
      estado: true,
      fechaCreacion: '2024-01-02',
      fechaModificacion: '2024-01-02'
    } as unknown as PersonaResponse;

    service.createPersona(newPersona).subscribe(response => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPersona);
    req.flush(expectedResponse);
  });

  it('should handle errors in getPersona', () => {
    service.getPersona(0, 10).subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${baseUrl}?page=0&size=10`);
    req.error(new ErrorEvent('Network error'));
  });

  it('should handle errors in createPersona', () => {
    const newPersona: CreatePersonaRequest = {
      nombre: 'Test',
      apellido: 'Error',
      documento: '11111',
      tipoDocumento: { id: '1', nombre: 'Cédula' },
      email: 'test@example.com',
      fechaNacimiento: new Date('1990-01-01'),
      celular: '3101111111',
      direccion: 'Test Address',
      genero: 'M',
      tallaCamiseta: 'M',
      eps: 'Test EPS',
      rh: 'O+'
    };

    service.createPersona(newPersona).subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(baseUrl);
    req.error(new ErrorEvent('Validation error'));
  });
});