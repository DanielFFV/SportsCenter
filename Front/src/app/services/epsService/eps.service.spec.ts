import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EpsService } from './eps.service';
import { EpsResponse } from 'src/app/models/eps';
import { environment } from 'src/environments/environment';

describe('EpsService', () => {
  let service: EpsService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.baseUrl + "/eps";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EpsService]
    });

    service = TestBed.inject(EpsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no haya solicitudes HTTP pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all EPS records', () => {
    const mockEpsList: EpsResponse[] = [
      { id: '1', nombre: 'EPS Ejemplo 1', estado: true },
      { id: '2', nombre: 'EPS Ejemplo 2', estado: false }
    ];

    const mockResponse = { 
      content: mockEpsList,
      totalPages: 1,
      totalElements: 2
    };

    service.getAllRecords().subscribe(epsList => {
      expect(epsList.length).toBe(2);
      expect(epsList[0].nombre).toBe('EPS Ejemplo 1');
      expect(epsList[1].estado).toBe(false);
    });

    const req = httpMock.expectOne(`${baseUrl}?page=0&size=30`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch paginated EPS records', () => {
    const mockEpsList: EpsResponse[] = [
      { id: '1', nombre: 'EPS Ejemplo 1', estado: true },
      { id: '2', nombre: 'EPS Ejemplo 2', estado: false }
    ];

    const mockResponse = { 
      content: mockEpsList,
      totalPages: 1,
      totalElements: 2
    };

    service.getEpsPaginado(0, 10).subscribe(epsList => {
      expect(epsList.length).toBe(2);
      expect(epsList[0].id).toBe('1');
      expect(epsList[1].nombre).toBe('EPS Ejemplo 2');
    });

    const req = httpMock.expectOne(`${baseUrl}?page=0&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle empty response when fetching EPS records', () => {
    const mockResponse = { 
      content: [],
      totalPages: 0,
      totalElements: 0
    };

    service.getAllRecords().subscribe(epsList => {
      expect(epsList.length).toBe(0);
    });

    const req = httpMock.expectOne(`${baseUrl}?page=0&size=30`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should use default pagination parameters', () => {
    const mockEpsList: EpsResponse[] = [
      { id: '1', nombre: 'EPS Ejemplo', estado: true }
    ];

    const mockResponse = { 
      content: mockEpsList,
      totalPages: 1,
      totalElements: 1
    };

    service.getAllRecords().subscribe();

    const req = httpMock.expectOne(`${baseUrl}?page=0&size=30`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});