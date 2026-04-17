import { TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentosService } from './documentos.service';

describe('DocumentosService', () => {
  let service: DocumentosService;
  let sanitizerSpy: jasmine.SpyObj<DomSanitizer>;

  beforeEach(() => {
    // Crear un spy para DomSanitizer
    const spy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);

    TestBed.configureTestingModule({
      providers: [
        DocumentosService,
        { provide: DomSanitizer, useValue: spy }
      ]
    });

    service = TestBed.inject(DocumentosService);
    sanitizerSpy = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return SafeResourceUrl for Términos y Condiciones', () => {
    const mockSafeUrl: SafeResourceUrl = {} as SafeResourceUrl;
    const expectedPath = 'assets/documents/legal/terminos-condiciones.pdf';

    sanitizerSpy.bypassSecurityTrustResourceUrl.and.returnValue(mockSafeUrl);

    const result = service.getTerminosCondiciones();

    expect(sanitizerSpy.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(expectedPath);
    expect(result).toBe(mockSafeUrl);
  });

  it('should return SafeResourceUrl for Política de Datos', () => {
    const mockSafeUrl: SafeResourceUrl = {} as SafeResourceUrl;
    const expectedPath = 'assets/documents/legal/politica-datos.pdf';

    sanitizerSpy.bypassSecurityTrustResourceUrl.and.returnValue(mockSafeUrl);

    const result = service.getPoliticaDatos();

    expect(sanitizerSpy.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(expectedPath);
    expect(result).toBe(mockSafeUrl);
  });

  it('should use correct document path for both methods', () => {
    const expectedBasePath = 'assets/documents/legal';

    service.getTerminosCondiciones();
    service.getPoliticaDatos();

    const terminosPath = sanitizerSpy.bypassSecurityTrustResourceUrl.calls.first().args[0];
    const politicaPath = sanitizerSpy.bypassSecurityTrustResourceUrl.calls.mostRecent().args[0];

    expect(terminosPath).toContain(expectedBasePath);
    expect(politicaPath).toContain(expectedBasePath);
  });
});