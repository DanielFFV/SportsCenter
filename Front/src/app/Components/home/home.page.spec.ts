import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { CarreraService } from '../../services/carreraService/carrera.service';
import { SessionService } from '../../services/sessionService/session.service';
import { NavController, ModalController, IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let carreraServiceMock: jasmine.SpyObj<CarreraService>;
  let sessionServiceMock: jasmine.SpyObj<SessionService>;
  let navControllerMock: jasmine.SpyObj<NavController>;
  let modalControllerMock: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    // Crear mocks para los servicios
    carreraServiceMock = jasmine.createSpyObj('CarreraService', ['getCarreras']);
    sessionServiceMock = jasmine.createSpyObj('SessionService', ['clearUserData']);
    navControllerMock = jasmine.createSpyObj('NavController', ['navigateForward']);
    modalControllerMock = jasmine.createSpyObj('ModalController', ['create']);

    // Configurar el mock de getCarreras para devolver datos de prueba
    // carreraServiceMock.getCarreras.and.returnValue(of({
    //   content: [
    //     { 
    //       id: 1, 
    //       nombre: 'Carrera de Prueba', 
    //       identificacion: 'TEST-001' 
    //     }
    //   ],
    //   last: true
    // }));

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), HomePage],
      providers: [
        { provide: CarreraService, useValue: carreraServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: NavController, useValue: navControllerMock },
        { provide: ModalController, useValue: modalControllerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // it('should load carreras on init', () => {
  //   expect(carreraServiceMock.getCarreras).toHaveBeenCalledWith(0, 10);
  //   expect(component.carreras.length).toBeGreaterThan(0);
  // });

  // it('should clear user data on init', () => {
  //   expect(sessionServiceMock.clearUserData).toHaveBeenCalled();
  // });

  // it('should get short identification', () => {
  //   const shortId = component.getIdentificacionCorta('TEST-001-EXTRA');
  //   expect(shortId).toBe('TEST-001');
  // });

  // it('should navigate to a route', () => {
  //   component.routerLink('test-route');
  //   expect(navControllerMock.navigateForward).toHaveBeenCalledWith('/test-route');
  // });

  // it('should get random color', () => {
  //   const color = component.getColorAleatorio();
  //   expect(component.colores).toContain(color);
  // });

  // it('should load more carreras when hasNext is true', () => {
  //   const mockEvent = { 
  //     target: { 
  //       complete: jasmine.createSpy('complete'),
  //       disabled: false 
  //     } 
  //   };

  //   // Resetear el mock para verificar la llamada
  //   carreraServiceMock.getCarreras.calls.reset();

  //   component.hasNext = true;
  //   component.loadMore(mockEvent);

  //   expect(carreraServiceMock.getCarreras).toHaveBeenCalledWith(1, 10);
  //   expect(mockEvent.target.complete).toHaveBeenCalled();
  // });

  // it('should not load more carreras when hasNext is false', () => {
  //   const mockEvent = { 
  //     target: { 
  //       complete: jasmine.createSpy('complete'),
  //       disabled: false 
  //     } 
  //   };

  //   component.hasNext = false;
  //   component.loadMore(mockEvent);

  //   expect(mockEvent.target.disabled).toBe(true);
  // });

  // it('should open modal for race details', async () => {
  //   const mockCarrera = { 
  //     id: 1, 
  //     nombre: 'Carrera de Prueba', 
  //     identificacion: 'TEST-001' 
  //   };

  //   modalControllerMock.create.and.returnValue(Promise.resolve({
  //     present: () => Promise.resolve(),
  //     onWillDismiss: () => Promise.resolve({ data: {} })
  //   } as any));

  //   await component.openModalDetalle(mockCarrera);

  //   expect(modalControllerMock.create).toHaveBeenCalled();
  // });
});