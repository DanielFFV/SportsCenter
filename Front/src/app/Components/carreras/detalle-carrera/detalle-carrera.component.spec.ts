import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, ToastController, AlertController } from '@ionic/angular';
import { DetalleCarreraComponent } from './detalle-carrera.component';
import { RegistroCarreraService } from 'src/app/services/registroCarreraService/registro-carrera.service';
import { SessionService } from 'src/app/services/sessionService/session.service';
import { of, throwError } from 'rxjs';

describe('DetalleCarreraComponent', () => {
  let component: DetalleCarreraComponent;
  let fixture: ComponentFixture<DetalleCarreraComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let registroCarreraServiceSpy: jasmine.SpyObj<RegistroCarreraService>;
  let sessionServiceSpy: jasmine.SpyObj<SessionService>;

  beforeEach(waitForAsync(async () => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
    toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    registroCarreraServiceSpy = jasmine.createSpyObj('RegistroCarreraService', ['getCarrerasActivas', 'registrarse']);
    sessionServiceSpy = jasmine.createSpyObj('SessionService', ['getUserData']);

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), DetalleCarreraComponent],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: ToastController, useValue: toastControllerSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: RegistroCarreraService, useValue: registroCarreraServiceSpy },
        { provide: SessionService, useValue: sessionServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleCarreraComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal when closeModal is called', () => {
    component.closeModal();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledWith(null, 'cancel');
  });

  it('should determine if user can register for a race', () => {
    component.registroCarreras = [{ carrera: { id: 2 } } as any];
    expect(component.puedeInscribir({ id: 1 } as any)).toBeTrue();
    expect(component.puedeInscribir({ id: 2 } as any)).toBeFalse();
  });

  it('should show alert when inscribirse is called', async () => {
    const alertSpy = jasmine.createSpyObj('Alert', ['present']);
    alertControllerSpy.create.and.returnValue(Promise.resolve(alertSpy));

    await component.inscribirse();

    expect(alertControllerSpy.create).toHaveBeenCalled();
    expect(alertSpy.present).toHaveBeenCalled();
  });

});
