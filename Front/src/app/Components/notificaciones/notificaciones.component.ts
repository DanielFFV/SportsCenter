import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { IonHeader } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { checkmark, checkmarkCircle, closeCircle, information, informationCircleOutline } from 'ionicons/icons';
import { CorredorResponse } from 'src/app/models/corredor';
import { CorredorGrupoResponse } from 'src/app/models/corredorGrupo';
import { GrupoResponse } from 'src/app/models/grupo';
import { LoginResponse } from 'src/app/models/login';
import { PaginatedResponse } from 'src/app/models/PaginatedResponse';
import { SolicitudGrupo } from 'src/app/models/solicitudGrupo';
import { CorredorGrupoService } from 'src/app/services/corredorGrupoService/corredor-grupo.service';
import { SessionService } from 'src/app/services/sessionService/session.service';
import { SolicitudService } from 'src/app/services/solicitudService/solicitud.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss'],
  standalone: true,
  imports:[
    CommonModule,
    IonicModule
  ],
  providers:[
    SolicitudService,
    CorredorGrupoService
  ]
})
export class NotificacionesComponent  implements OnInit {

  solicitudes: SolicitudGrupo[] = []; 
  corredor?: CorredorResponse;
  grupo: GrupoResponse | null = null;
  page: number = 0; // Página inicial
  size: number = 10; // Tamaño de la página

  constructor(
    private solicitudService: SolicitudService,
    private toastController: ToastController,
    private sessionService: SessionService,
    private corredorGrupo: CorredorGrupoService
  ) {
    const response: LoginResponse | null = this.sessionService.getUserData();
    if (response) {
      this.corredor = response.corredor ; // Actualiza userData con los datos de persona
      this.grupo = response.grupo
      this.validarCapitan()
    } else {
      console.log("No se encontró la información de la persona.");
    }
    addIcons({ 'checkmark-circle': checkmarkCircle, 'close-circle': closeCircle, 'information-circle-outline':informationCircleOutline });
  }
  validarCapitan() {
    if(this.grupo!=null){
      this.corredorGrupo.getCapitan(this.grupo.id).subscribe((data: CorredorGrupoResponse) => {
        // Comparar los IDs de manera correcta
        if (this.corredor?.id === data.corredor.id) {
          this.getSolicitudesPendientes();
        } 
      });
    }
    
  }
  ngOnInit() {
    
    this.getSolicitudesPendientes();
  }

  // Método para obtener las solicitudes pendientes
  getSolicitudesPendientes() {
   
    this.solicitudService.getPeticionesPendientesCapitan(this.grupo!.id, this.page, this.size)
      .subscribe({
        next: (data: PaginatedResponse<SolicitudGrupo>) => {
          this.solicitudes = data.content;  // Asignar el array de solicitudes a `solicitudes`
        },
        error: (err:any) => {
          console.error('Error al obtener las solicitudes pendientes', err);
        }
      });
  }
  async aceptarSolicitud(solicitud: SolicitudGrupo) {
    try {
      const response = await this.solicitudService.afirmarPeticion(solicitud.id).toPromise();
      await this.presentToast('Solicitud aceptada con éxito!', 'success');
      this.getSolicitudesPendientes();
    } catch (error) {
      await this.presentToast('Error al aceptar la solicitud. Intenta nuevamente.', 'danger');
      console.error('Error al aceptar la solicitud:', error);
    }
  }

  async rechazarSolicitud(solicitud: SolicitudGrupo) {
    try {
      const response = await this.solicitudService.negarPeticion(solicitud.id).toPromise();
      await this.presentToast('Solicitud rechazada con éxito!', 'success');
      this.getSolicitudesPendientes();
    } catch (error) {
      await this.presentToast('Error al rechazar la solicitud. Intenta nuevamente.', 'danger');
      console.error('Error al rechazar la solicitud:', error);
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: 2000, // Duración del toast en milisegundos
      position: 'top', // Posición del toast
    });
    await toast.present();
  }
}
