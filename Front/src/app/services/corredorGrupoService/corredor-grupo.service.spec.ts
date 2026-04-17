import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CorredorGrupoService } from './corredor-grupo.service';
import { environment } from 'src/environments/environment';
import { CorredorGrupoResponse } from 'src/app/models/corredorGrupo';
import { CorredorResponse } from 'src/app/models/corredor';
import { PersonaResponse } from 'src/app/models/persona';
import { TipoDocumentoResponse } from 'src/app/models/TipoDocumento';
import { PaginatedResponse } from 'src/app/models/PaginatedResponse';

describe('CorredorGrupoService', () => {
  let service: CorredorGrupoService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.baseUrl + "/corredorGrupo";

  // Función auxiliar para crear un mock de TipoDocumento
  const createMockTipoDocumento = (id: string, nombre: string): TipoDocumentoResponse => ({
    id,
    nombre
  });

  // Función auxiliar para crear un mock de Persona
  const createMockPersona = (id: string, nombre: string, apellido: string): PersonaResponse => ({
    id,
    nombre,
    apellido,
    documento: '1234567890',
    tipoDocumento: createMockTipoDocumento('1', 'Cédula'),
    email: `${nombre.toLowerCase()}@example.com`,
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
  });

  // Función auxiliar para crear un mock de Corredor
  const createMockCorredor = (id: string, nombre: string, apellido: string): CorredorResponse => ({
    id,
    persona: createMockPersona(id, nombre, apellido),
    dorsal: Math.floor(Math.random() * 1000),
    estado: true,
    fechaCreacion: new Date().toISOString(),
    fechaModificacion: new Date().toISOString()
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CorredorGrupoService]
    });

    service = TestBed.inject(CorredorGrupoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get miembros de grupo', () => {
    // Crear mocks de corredores
    const mockCorredor1 = createMockCorredor('corredor1', 'Juan', 'Pérez');
    const mockCorredor2 = createMockCorredor('corredor2', 'María', 'Gómez');

    const mockMiembrosGrupo: PaginatedResponse<CorredorGrupoResponse> = {
      content: [
        {
          id: '1',
          corredor: mockCorredor1,
          grupo: 'grupo1',
          capitan: false,
          estado: true,
          fechaCreacion: new Date().toISOString(),
          fechaModificacion: new Date().toISOString()
        },
        {
          id: '2',
          corredor: mockCorredor2,
          grupo: 'grupo1',
          capitan: false,
          estado: true,
          fechaCreacion: new Date().toISOString(),
          fechaModificacion: new Date().toISOString()
        }
      ],
      pageable: {
        pageNumber: 0,
        pageSize: 10,
        sort: {
          empty: false,
          sorted: true,
          unsorted: false
        },
        offset: 0,
        paged: true,
        unpaged: false
      },
      last: true,
      // totalPages: 1,
      // totalElements: 2,
      size: 10,
      number: 0,
      sort: {
        empty: false,
        sorted: true,
        unsorted: false
      },
      first: true,
      numberOfElements: 2,
      empty: false
    };

    service.getMiembrosGrupo('grupo1').subscribe({
      next: (response) => {
        expect(response).toEqual(mockMiembrosGrupo);
        expect(response.content.length).toBe(2);
        expect(response.content[0].grupo).toBe('grupo1');
        
        // Verificaciones adicionales de la estructura
        response.content.forEach(miembro => {
          expect(miembro.corredor.persona).toBeTruthy();
          expect(miembro.corredor.persona.tipoDocumento).toBeTruthy();
        });
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/grupo/grupo1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMiembrosGrupo);
  });

  it('should get capitan de grupo', () => {
    // Crear mock de corredor capitán
    const mockCapitanCorredor = createMockCorredor('corredor3', 'Carlos', 'Rodríguez');

    const mockCapitan: CorredorGrupoResponse = {
      id: '3',
      corredor: mockCapitanCorredor,
      grupo: 'grupo1',
      capitan: true,
      estado: true,
      fechaCreacion: new Date().toISOString(),
      fechaModificacion: new Date().toISOString()
    };

    service.getCapitan('grupo1').subscribe({
      next: (response) => {
        expect(response).toEqual(mockCapitan);
        expect(response.capitan).toBe(true);
        expect(response.grupo).toBe('grupo1');
        
        // Verificaciones adicionales de la estructura
        expect(response.corredor.persona).toBeTruthy();
        expect(response.corredor.persona.tipoDocumento).toBeTruthy();
        expect(response.corredor.persona.nombre).toBe('Carlos');
        expect(response.corredor.persona.apellido).toBe('Rodríguez');
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/grupoCapitan/grupo1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCapitan);
  });
});