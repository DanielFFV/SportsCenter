import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListadoCarrerasDisponiblesComponent } from './listado-carreras-disponibles.component';

describe('ListadoCarrerasDisponiblesComponent', () => {
  let component: ListadoCarrerasDisponiblesComponent;
  let fixture: ComponentFixture<ListadoCarrerasDisponiblesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoCarrerasDisponiblesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoCarrerasDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
