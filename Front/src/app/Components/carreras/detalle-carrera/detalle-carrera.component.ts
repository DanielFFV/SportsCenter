import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { AlertController, IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CarreraResponse } from 'src/app/models/carrera';
import { CorredorResponse } from 'src/app/models/corredor';
import { LoginResponse } from 'src/app/models/login';
import { RegistroCarreraResponse } from 'src/app/models/registroCarrera';
import { RegistroCarreraService } from 'src/app/services/registroCarreraService/registro-carrera.service';
import { SessionService } from 'src/app/services/sessionService/session.service';
import { addIcons } from 'ionicons';
import { locationOutline, calendarOutline, personOutline, clipboardOutline, checkmarkCircleOutline, closeCircleOutline, checkmarkCircle, calendarSharp, alertCircle, 
  accessibilityOutline, accessibilitySharp, closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-detalle-carrera',
  templateUrl: './detalle-carrera.component.html',
  styleUrls: ['./detalle-carrera.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ],
  providers: [
    RegistroCarreraService,
    SessionService
  ]
})
export class DetalleCarreraComponent  implements OnInit {
  @Input() carrera!: CarreraResponse; 
  @Input() identificacionCorta: string = '';
  @Input() home: boolean = false;

  // Aplicar clases CSS al host element
  @HostBinding('class') get classes() {
    return 'modal-container';
  }

  corredor: CorredorResponse | null = null;
  registroCarreras: RegistroCarreraResponse[] = [];
  isLoading: boolean = true;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private sessionService: SessionService,
    private alertController: AlertController,
    private registroCarreraService: RegistroCarreraService

  ) { 
    addIcons({
      locationOutline, calendarOutline, personOutline, clipboardOutline, checkmarkCircleOutline, closeCircleOutline, checkmarkCircle, 
      calendarSharp, alertCircle, accessibilityOutline, accessibilitySharp, closeOutline
    });
  }
  
  ngOnInit() {
    this.initializeUserData();
  }

  private async initializeUserData() {
    const response: LoginResponse | null = this.sessionService.getUserData();
    if (response?.persona) {
      this.corredor = response.corredor;
      await this.loadCarrerasActivas();
    }
    this.isLoading = false;
  }

  private async loadCarrerasActivas(): Promise<void> {
    try {
      const data: any = await this.registroCarreraService
        .getCarrerasActivas(this.corredor!.id, 0, 100)
        .toPromise();
      
      this.registroCarreras = data.content;
    } catch (error) {
      console.error('Error loading carreras:', error);
      this.presentToast('Error al cargar las carreras', false);
    }
  }

  puedeInscribir(carrera: CarreraResponse): boolean{
    if (!this.corredor) return false;

    const carreraExistente = this.registroCarreras.find(registro => registro.carrera.id === carrera.id);
    
    if (carreraExistente) {
        return false; // Si ya está registrada, no se puede registrar de nuevo
    } else {
      if ((this.identificacionCorta + "-MAIN") == carrera.identificacion){
        return false; 
      }
        return true; // Si no está registrada, se puede registrar
    }
  }

  async closeModal() {
    try {
      await this.modalController.dismiss(null, 'cancel');
    } catch (error) {
      console.error('Error closing modal:', error);
    }
  }

  /* Inscribirse en la carrea */
  async inscribirse() {
    const response: LoginResponse | null = this.sessionService.getUserData();
    
    if (response?.persona) {
      const { persona, corredor, grupo } = response;
  
      const alert = await this.alertController.create({
        header: 'Confirmación',
        message: '¿Estás seguro de que deseas inscribirte en esta carrera?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Inscripción cancelada');
            }
          },
          {
            text: 'Confirmar',
            handler: () => {
              this.registroCarreraService.registrarse({
                carreraId: this.carrera.id,
                corredorId: corredor.id,
                grupoId: grupo?.id ?? null
              }).subscribe(
                (data: any) => {
                  this.presentToast('Inscripción exitosa', true);
                  this.loadCarrerasActivas();

                },
                (error: any) => {
                  console.error('Error en el registro', error);
                  this.presentToast('Error al inscribirse', false);
                }
              );
            }
          }
        ]
      });
  
      try {
        await alert.present();
      } catch (error) {
        console.error('Error al mostrar el alert:', error);
        this.presentToast('Error al mostrar confirmación', false);
      }
    }
  }
  
  async presentToast(message: string, result: boolean = true) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: result ? 'success' : 'danger'
    });
    await toast.present();
  }

}
