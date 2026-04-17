import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { LoginRequest, LoginResponse } from 'src/app/models/login';
import { environment } from 'src/environments/environment';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.baseUrl + '/login';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService]
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no haya solicitudes HTTP pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform login successfully', () => {
    const loginRequest: LoginRequest = {
      email: 'usuario@ejemplo.com',
      password: 'contrasena123'
    };

    const mockLoginResponse: LoginResponse = {
      persona: {
        id: '1',
        nombre: 'Juan',
        apellido: 'Pérez',
        documento: '12345678',
        tipoDocumento: {id: '1', nombre: 'Cédula'},
        email: 'usuario@ejemplo.com',
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
      corredor: {
        id: 'corredor1',
        persona: {
          id: '1',
          nombre: 'Juan',
          apellido: 'Pérez',
          documento: '12345678',
          tipoDocumento: {id: '1', nombre: 'Cédula'},
          email: 'usuario@ejemplo.com',
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
      },
      grupo: {
        id: 'grupo1',
        nombre: 'Grupo Ejemplo',
        cantidadCorredor: 5,
        estado: true,
        fechaCreacion: '2024-01-01',
        fechaModificacion: '2024-01-02'
      }
    };

    service.login(loginRequest).subscribe(response => {
      expect(response).toEqual(mockLoginResponse);
      expect(response.persona.email).toBe('usuario@ejemplo.com');
      expect(response.corredor.dorsal).toBe(10);
      expect(response.grupo.nombre).toBe('Grupo Ejemplo');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginRequest);
    req.flush(mockLoginResponse);
  });

  // it('should handle login with minimal data', () => {
  //   const minimalLoginRequest: LoginRequest = {
  //     email: 'minimal@ejemplo.com',
  //     password: 'pass123'
  //   };

  //   const minimalLoginResponse: LoginResponse = {
  //     persona: {
  //       id: '2',
  //       nombre: 'Ana',
  //       apellido: 'García',
  //       documento: '87654321',
  //       email: 'minimal@ejemplo.com',
  //       tipoDocumento: {id: '1', nombre: 'Cédula'},
  //       estado: true,
  //       fechaNacimiento: '1990-01-01',
  //       celular: '3101234567',
  //       direccion: 'Calle Falsa 123',
  //       genero: 'M',
  //       tallaCamiseta: 'M',
  //       eps: 'EPS Test',
  //       rh: 'O+',
  //       fechaCreacion: new Date().toISOString(),
  //       fechaModificacion: new Date().toISOString()
  //     },
  //     corredor: null,
  //     grupo: null
  //   };

  //   service.login(minimalLoginRequest).subscribe(response => {
  //     expect(response.persona.email).toBe('minimal@ejemplo.com');
  //     expect(response.corredor).toBeNull();
  //     expect(response.grupo).toBeNull();
  //   });

  //   const req = httpMock.expectOne(baseUrl);
  //   expect(req.request.method).toBe('POST');
  //   req.flush(minimalLoginResponse);
  // });

  it('should validate login request structure', () => {
    const loginRequest: LoginRequest = {
      email: 'test@ejemplo.com',
      password: 'password123'
    };

    service.login(loginRequest).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.body).toEqual(jasmine.objectContaining({
      email: jasmine.any(String),
      password: jasmine.any(String)
    }));
    req.flush({});
  });

  it('should use the correct base URL for login', () => {
    const loginRequest: LoginRequest = {
      email: 'url@ejemplo.com',
      password: 'urltest'
    };

    service.login(loginRequest).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.url).toBe(baseUrl);
  });
});