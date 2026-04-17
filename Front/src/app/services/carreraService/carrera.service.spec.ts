import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CarreraService } from './carrera.service';
import { environment } from 'src/environments/environment';
import { CreateCarreraRequest, CarreraResponse } from '../../models/carrera';

describe('CarreraService', () => {
  let service: CarreraService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.baseUrl + "/carrera";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CarreraService]
    });

    service = TestBed.inject(CarreraService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get carreras with pagination', () => {
    const mockCarreras: CarreraResponse[] = [
      {
        id: '1',
        nombre: 'Carrera Marathon',
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
      }
    ];

    service.getCarreras(0, 10).subscribe(response => {
      expect(response).toEqual(mockCarreras);
      // expect(response.length).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}?page=0&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCarreras);
  });

  it('should get vigentes carreras with pagination', () => {
    const mockCarrerasVigentes: CarreraResponse[] = [
      {
        id: '2',
        nombre: 'Carrera 10k',
        ubicacion: 'Parque Central',
        responsable: 'María García',
        identificacion: 'CARRE-002',
        estado: true,
        estadoGrupos: true,
        fechaCarrera: new Date('2024-07-20'),
        fechaCreacion: new Date('2024-02-15'),
        fechaModificacion: new Date('2024-03-25'),
        distancia: '10km',
        cupoMaximo: 300,
        carreraPadreId: "",
        edadMinima: '16',
        fechaCierreInscripciones: new Date('2024-07-10'),
        edadMaxima: '55',
        identificacionCorta: 'CAR-002',
        numeroParticipantes: 150,
        precio: 30.00
      }
    ];

    service.getCarrerasVigentes(0, 10).subscribe(response => {
      expect(response).toEqual(mockCarrerasVigentes);
      // expect(response.length).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/estado?page=0&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCarrerasVigentes);
  });

  it('should create a new carrera', () => {
    const newCarrera: CreateCarreraRequest = {
      nombre: 'Nueva Carrera Trail',
      ubicacion: 'Bosque Montañoso',
      responsable: 'Carlos Rodríguez',
      identificacion: 'TRAIL-001',
      fechaCarrera: new Date('2024-08-15'),
      distancia: '21km',
      fechaCierreInscripciones: new Date('2024-08-01'),
      cupoMaximo: 200
    };

    const mockResponse: CarreraResponse = {
      id: '3',
      nombre: 'Nueva Carrera Trail',
      ubicacion: 'Bosque Montañoso',
      responsable: 'Carlos Rodríguez',
      identificacion: 'TRAIL-001',
      estado: true,
      estadoGrupos: false,
      fechaCarrera: new Date('2024-08-15'),
      fechaCreacion: new Date(),
      fechaModificacion: new Date(),
      distancia: '21km',
      cupoMaximo: 200,
      carreraPadreId: "",
      edadMinima: '18',
      fechaCierreInscripciones: new Date('2024-08-01'),
      edadMaxima: '50',
      identificacionCorta: 'TRL-001',
      numeroParticipantes: 0,
      precio: 40.00
    };

    service.createCarrera(newCarrera).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.id).toBeTruthy();
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCarrera);
    req.flush(mockResponse);
  });
});