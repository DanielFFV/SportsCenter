import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicModule, IonModal, ModalController, NavController, PopoverController } from '@ionic/angular';
import { CrearCarreraComponent } from "../../carreras/crear-carrera/crear-carrera.component";
import { CarreraService } from '../../../services/carreraService/carrera.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CarreraResponse } from 'src/app/models/carrera';
import { DetalleCarreraComponent } from '../../carreras/detalle-carrera/detalle-carrera.component';
import { accessibility, checkmark, notifications, notificationsOutline, people, person, logOutOutline,logOut, flagOutline, timerOutline
  , checkmarkCircle, alertCircle, informationCircleOutline,exitOutline, personAddOutline, addCircleOutline, searchOutline, checkmarkCircleOutline, 
  enterOutline, shield, star, mailOutline, documentTextOutline, idCardOutline, calendarOutline, timeOutline, trailSignOutline, closeOutline, 
  callOutline, homeOutline, maleFemaleOutline, shirtOutline, medkitOutline, waterOutline, personOutline, peopleOutline, speedometerOutline, 
  calendarSharp, calendarClear, calendarNumber, calendar, playCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ListadoCarrerasDisponiblesComponent } from "../../carreras/listado-carreras-disponibles/listado-carreras-disponibles.component";
import { FormsModule } from '@angular/forms';
import { SessionService } from 'src/app/services/sessionService/session.service';
import { PersonaResponse } from 'src/app/models/persona';
import { LoginResponse } from 'src/app/models/login';
import { GestionGrupoComponent } from "../../grupo/gestion-grupo/gestion-grupo.component";
import { CarrerasActivasComponent } from '../../carreras/carreras-activas/carreras-activas.component';
import { PerfilUsuarioComponent } from '../perfil-usuario/perfil-usuario.component';
import { NotificacionesComponent } from '../../notificaciones/notificaciones.component';
import { SolicitudGrupo } from 'src/app/models/solicitudGrupo';
import { GrupoResponse } from 'src/app/models/grupo';
import { CorredorGrupoService } from 'src/app/services/corredorGrupoService/corredor-grupo.service';
import { CorredorGrupoResponse } from 'src/app/models/corredorGrupo';
import { CorredorResponse } from 'src/app/models/corredor';
import { SolicitudService } from 'src/app/services/solicitudService/solicitud.service';
import { PaginatedResponse } from 'src/app/models/PaginatedResponse';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// import { UsuarioFeedComponent } from '../usuario-feed/usuario-feed.component';

@Component({
  selector: 'app-menu-usuario',
  templateUrl: './menu-usuario.component.html',
  styleUrls: ['./menu-usuario.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CrearCarreraComponent,
    CarrerasActivasComponent,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ListadoCarrerasDisponiblesComponent,
    GestionGrupoComponent,
    PerfilUsuarioComponent
    // ,UsuarioFeedComponent
],
  providers: [CarreraService,CorredorGrupoService,SolicitudService]
})
export class MenuUsuarioComponent  implements OnInit {
  @ViewChild(IonModal) modal!: IonModal ;
  
  userData: PersonaResponse | null = null;
  solicitudes: SolicitudGrupo[] = []; 
  corredor?: CorredorResponse;
  cantNotificaciones = 0;
  grupo: GrupoResponse | null = null;
  selectedSegment: string = 'carrerasDisp';

  private unsubscribe$ = new Subject<void>();

  constructor(
    private navCtrl: NavController,
    private modalController: ModalController,
    private carreraService: CarreraService,
    private sessionService: SessionService,
    private popoverController: PopoverController,
    private corredorGrupo: CorredorGrupoService,
    private solicitudService: SolicitudService,


  ) {
    addIcons({ accessibility, people, checkmark, person, logOut, logOutOutline, notifications, notificationsOutline, flagOutline, timerOutline, 
      checkmarkCircle, alertCircle, informationCircleOutline,exitOutline, personAddOutline, addCircleOutline, searchOutline, checkmarkCircleOutline, enterOutline,
      shield, star, mailOutline, documentTextOutline, idCardOutline, calendarOutline, timeOutline, trailSignOutline, closeOutline, callOutline, homeOutline, 
      maleFemaleOutline, shirtOutline, medkitOutline, waterOutline, personOutline, peopleOutline, speedometerOutline, calendarSharp, calendarClear, calendarNumber, calendar, 
      playCircleOutline });
    //this.selectedSegment= 'carrerasDisp';

   }

  ngOnInit() {
    this.loadUserData();  
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private loadUserData() {
    const response: LoginResponse | null = this.sessionService.getUserData();
    if (response) {
      this.userData = response.persona; // Actualiza userData con los datos de persona
      this.grupo = response.grupo
      this.corredor = response.corredor ;
      this.validarCapitan()
      // this.selectedSegment= 'carrerasDisp';
    } else {
      console.error("No se encontró la información del usuario.");
      console.log("No se encontró la información de la persona.");
    }
  }

  validarCapitan() {
    if (this.grupo) {
      this.solicitudService.getPeticionesPendientesCapitan(this.grupo.id, 0, 1000)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (data: PaginatedResponse<SolicitudGrupo>) => {
            this.solicitudes = data.content;
            this.cantNotificaciones = data.numberOfElements;
          },
          error: (err) => console.error('Error al obtener las solicitudes pendientes', err)
        });
    }
  }
  // Método para obtener las solicitudes pendientes
  getSolicitudesPendientes() {
    
    this.solicitudService.getPeticionesPendientesCapitan(this.grupo!.id, 0, 1000)
      .subscribe({
        next: (data: PaginatedResponse<SolicitudGrupo>) => {
          this.solicitudes = data.content;  // Asignar el array de solicitudes a `solicitudes`
          this.cantNotificaciones = data.numberOfElements;
        },
        error: (err:any) => {
          console.error('Error al obtener las solicitudes pendientes', err);
        }
      });
  }


  async openModal() {
  const modal = await this.modalController.create({
      component: CrearCarreraComponent,  
      componentProps: {
        // Puedes pasar datos al modal si es necesario
      },
    });

    modal.onWillDismiss().then((event) => this.onWillDismiss(event));
    await modal.present();
  }
  /*
  Manejo de modals
  */
  async openPopoverNotificaciones(ev: any) {
    const popover = await this.popoverController.create({
      component: NotificacionesComponent,  // Componente que mostrarás en el popover
      event: ev,  // Posiciona el popover en relación al evento (el clic del botón)
      translucent: true,  // Hace el fondo translúcido
      cssClass: 'custom-popover'
    });
  
    await popover.present();

    const { role } = await popover.onDidDismiss();
    this.validarCapitan();  
  }

  async openModalDetalle(carreraResponse: CarreraResponse) {
    const modal = await this.modalController.create({
      component: DetalleCarreraComponent,  
        componentProps: {
            carrera: carreraResponse 
          },
      });
    
      modal.onWillDismiss().then((event) => this.onWillDismiss(event));
      await modal.present();
  }

  onWillDismiss(event: any) {
    const ev = event as CustomEvent<{ role: string; data: string }>;
    this.validarCapitan()
  }
 
  routerLink(ruta: string) {
    this.navCtrl.navigateForward('/'+ruta);
  }

  logout(){
    this.selectedSegment= 'carrerasDisp';
    this.userData = null;
    this.sessionService.logout();
    //this.navCtrl.navigateRoot('/login');
  }
}