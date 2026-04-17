import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { CarreraHijasModalComponent } from './carrera-hijas-modal.component';
import { CarreraResponse } from 'src/app/models/carrera';

describe('CarreraHijasModalComponent', () => {
  let component: CarreraHijasModalComponent;
  let fixture: ComponentFixture<CarreraHijasModalComponent>;
  let mockModalController: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    mockModalController = jasmine.createSpyObj('ModalController', ['dismiss']);

    await TestBed.configureTestingModule({
      declarations: [ CarreraHijasModalComponent ],
      imports: [ IonicModule.forRoot() ],
      providers: [
        { provide: ModalController, useValue: mockModalController }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CarreraHijasModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter carrerasHijas based on identificacionCortaPadre', () => {
    const mockCarreras: CarreraResponse[] = [
        { id: '1', nombreCarrera: 'Carrera 1', identificacionCorta: 'ABC-1' },
        { id: '2', nombreCarrera: 'Carrera 2', identificacionCorta: 'ABC-2' },
        { id: '3', nombreCarrera: 'Carrera 3', identificacionCorta: 'XYZ-1' }
    ] as unknown as CarreraResponse[];

    component.carrerasHijas = mockCarreras;
    component.identificacionCortaPadre = 'ABC';
    
    component.ngOnInit();

    expect(component.carrerasHijas.length).toBe(2);
    expect(component.carrerasHijas[0].identificacionCorta).toBe('ABC-1');
    expect(component.carrerasHijas[1].identificacionCorta).toBe('ABC-2');
  });

  it('should call dismissModal with correct parameters for individual inscription', () => {
    const mockCarrera: CarreraResponse = { id: '1', nombre: 'Carrera 1' } as CarreraResponse;
    
    component.inscribirseIndividual(mockCarrera);

    expect(mockModalController.dismiss).toHaveBeenCalledWith({ carrera: mockCarrera, esGrupal: false });
  });

  it('should call dismissModal with correct parameters for group inscription', () => {
    const mockCarrera: CarreraResponse = { id: '1', nombre: 'Carrera 1' } as CarreraResponse;
    
    component.inscribirseGrupo(mockCarrera);

    expect(mockModalController.dismiss).toHaveBeenCalledWith({ carrera: mockCarrera, esGrupal: true });
  });

  it('should call dismissModal without parameters when closing', () => {
    component.dismissModal();

    expect(mockModalController.dismiss).toHaveBeenCalledWith();
  });
});