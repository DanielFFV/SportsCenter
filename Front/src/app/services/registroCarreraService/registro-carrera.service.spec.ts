import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegistroCarreraService } from './registro-carrera.service';
import { environment } from 'src/environments/environment';
import { 
  RegistroCarreraRequest, 
  RegistroCarreraResponse,
  RegistroCarreraResponseCreateGrupo 
} from 'src/app/models/registroCarrera';
import { CarreraResponse } from 'src/app/models/carrera';
import { CorredorResponse } from 'src/app/models/corredor';
import { GrupoResponse } from 'src/app/models/grupo';

describe('RegistroCarreraService', () => {
  let service: RegistroCarreraService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.baseUrl + '/registroCarrera';

  // Mock data para pruebas
  const mockCarrera: CarreraResponse = {
    id: '1',
    nombre: 'Carrera de Prueba',
    ubicacion: 'Ciudad Principal',
    responsable: 'Juan Pérez',
    identificacion: 'CARRE-001',
    estado: true,
    estadoGrupos: true,
    fechaCarrera: new Date('2024-06-15'),
    fechaCreacion: new Date('2024-01-10'),
    fechaModificacion: new Date('2024-02-20'),
    distancia: '42km',
    cupoMaximo: 500,
    carreraPadreId: "",
    edadMinima: '18',
    fechaCierreInscripciones: new Date('2024-06-01'),
    edadMaxima: '65',
    identificacionCorta: 'CAR-001',
    numeroParticipantes: 250,
    precio: 50.00
  };

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

  const mockGrupo: GrupoResponse = {
    id: '1',
    nombre: 'Grupo Test',
    cantidadCorredor: 3,
    estado: true,
    fechaCreacion: new Date().toISOString(),
    fechaModificacion: new Date().toISOString()
  };

  const mockRegistroCarreraResponse: RegistroCarreraResponse = {
    id: '1',
    carrera: mockCarrera,
    identificacion: '1234567890',
    numeroRegistro: 1,
    fechaRegistro: '2024-01-01',
    corredor: mockCorredor,
    grupo: mockGrupo,
    estado: true,
    fechaCreacion: '2024-01-01',
    fechaModificacion: '2024-01-01'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegistroCarreraService]
    });

    service = TestBed.inject(RegistroCarreraService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a runner successfully', () => {
    const registroRequest: RegistroCarreraRequest = {
      carreraId: '1',
      corredorId: '1'
    };

    service.registrarse(registroRequest).subscribe(response => {
      expect(response).toEqual(mockRegistroCarreraResponse);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registroRequest);
    req.flush(mockRegistroCarreraResponse);
  });

  it('should register a group successfully', () => {
    const registroGrupoRequest: RegistroCarreraRequest = {
      carreraId: '1',
      corredorId: '1',
      grupoId: '1'
    };

    const mockRegistroGrupoResponse: RegistroCarreraResponseCreateGrupo = {
      listadoRegistros: [mockRegistroCarreraResponse]
    };

    service.registrarGrupo(registroGrupoRequest).subscribe(response => {
      expect(response).toEqual(mockRegistroGrupoResponse);
      expect(response.listadoRegistros.length).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/grupo`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registroGrupoRequest);
    req.flush(mockRegistroGrupoResponse);
  });

  it('should retrieve races by runner', () => {
    const corredorId = '1';
    const mockRegistros: RegistroCarreraResponse[] = [mockRegistroCarreraResponse];

    service.getByCorredor(corredorId).subscribe(response => {
      expect(response).toEqual(mockRegistros);
      expect(response.length).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/corredor/${corredorId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRegistros);
  });

  it('should retrieve active races for a runner with pagination', () => {
    const corredorId = '1';
    const page = 0;
    const size = 10;

    service.getCarrerasActivas(corredorId, page, size).subscribe(response => {
      expect(response).toEqual(mockRegistroCarreraResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/corredorFechaCarreraEstado/${corredorId}?page=${page}&size=${size}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRegistroCarreraResponse);
  });

  it('should exit a race successfully', () => {
    const registroId = '1';

    service.salirCarrera(registroId).subscribe(response => {
      expect(response).toEqual(mockRegistroCarreraResponse);
      // expect(response.estado).toBeFalsy(); // Asumiendo que al salir cambia el estado
    });

    const req = httpMock.expectOne(`${baseUrl}/inactivarCarrera/${registroId}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockRegistroCarreraResponse);
  });

  // Pruebas de manejo de errores
  it('should handle error when registering runner', () => {
    const registroRequest: RegistroCarreraRequest = {
      carreraId: '1',
      corredorId: '1'
    };

    service.registrarse(registroRequest).subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(baseUrl);
    req.error(new ErrorEvent('Registration failed'));
  });

  it('should handle error when retrieving races by runner', () => {
    const corredorId = '1';

    service.getByCorredor(corredorId).subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/corredor/${corredorId}`);
    req.error(new ErrorEvent('Fetch races failed'));
  });
});