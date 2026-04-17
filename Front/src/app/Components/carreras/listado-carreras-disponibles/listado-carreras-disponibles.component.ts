import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonicModule, IonModal, ModalController, ToastController } from '@ionic/angular';
import { CarreraResponse } from 'src/app/models/carrera';
import { CarreraService } from 'src/app/services/carreraService/carrera.service';
import { environment } from 'src/environments/environment';
import { DetalleCarreraComponent } from '../detalle-carrera/detalle-carrera.component';
import { RegistroCarreraService } from 'src/app/services/registroCarreraService/registro-carrera.service';
import { SessionService } from 'src/app/services/sessionService/session.service';
import { LoginResponse } from 'src/app/models/login';
import { CorredorResponse } from 'src/app/models/corredor';
import { RegistroCarreraResponse, RegistroCarreraResponseCreateGrupo } from 'src/app/models/registroCarrera';
import { GrupoResponse } from 'src/app/models/grupo';
import { CorredorGrupoService } from 'src/app/services/corredorGrupoService/corredor-grupo.service';
import { CorredorGrupoResponse } from 'src/app/models/corredorGrupo';
import { PaginatedResponse } from 'src/app/models/PaginatedResponse';
import { addIcons } from 'ionicons';
import {
  locationOutline, calendarOutline, peopleOutline, personOutline, clipboardOutline, checkmarkCircleOutline, chevronBackOutline, chevronForwardOutline,
  playCircleOutline
} from 'ionicons/icons';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es');
import { CarreraHijasModalComponent } from '../carreras-hijas-modal/carrera-hijas-modal.component';
import { count } from 'rxjs';

@Component({
  selector: 'app-listado-carreras-disponibles',
  templateUrl: './listado-carreras-disponibles.component.html',
  styleUrls: ['./listado-carreras-disponibles.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ],
  providers: [
    CarreraService,
    RegistroCarreraService,
    CorredorGrupoService,
    { provide: LOCALE_ID, useValue: 'es' }
  ]
})
export class ListadoCarrerasDisponiblesComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  corredor: CorredorResponse | null = null;
  registroCarreras: RegistroCarreraResponse[] = [];
  carreras: CarreraResponse[] = [];
  carrerasPadre: CarreraResponse[] = [];
  carrerasHijas: CarreraResponse[] = [];
  capitanEquipo: CorredorGrupoResponse[] = [];
  grupo!: GrupoResponse;

  colores: string[] = environment.colores;
  esCapitan: boolean = false;
  currentPage: number = 0;
  pageSize: number = 18;
  hasNext: boolean = true;
  static registroCarreras: any;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private carreraService: CarreraService,
    private modalController: ModalController,
    private registroCarreraService: RegistroCarreraService,
    private sessionService: SessionService,
    private corredorGrupo: CorredorGrupoService
  ) {
    this.initializeIcons();
    this.initializeUserData();
  }

  ngOnInit() {
    this.loadCarreras();
    this.loadCarrerasActivas();
  }

  private initializeIcons() {
    addIcons({
      locationOutline,
      calendarOutline,
      peopleOutline,
      personOutline,
      clipboardOutline,
      checkmarkCircleOutline,
      chevronBackOutline,
      chevronForwardOutline,
      playCircleOutline
    });
  }

  private initializeUserData() {
    const response: LoginResponse | null = this.sessionService.getUserData();
    if (response?.persona) {
      this.corredor = response.corredor;
      this.grupo = response.grupo;
    }
    this.validarCapitan();
  }

  loadCarreras() {
    this.carreraService.getCarrerasVigentes(this.currentPage, this.pageSize).subscribe({
      next: (data: any) => {
        const carrerasConColores = this.assignRandomColors(data.content);
        this.carreras = this.carreras.concat(carrerasConColores);
        this.separateCarreras();
        this.hasNext = !data.last;
        this.currentPage++;
      },
      error: (error) => console.error('Error loading carreras:', error)
    });
  }

  private assignRandomColors(carreras: CarreraResponse[]): CarreraResponse[] {
    return carreras.map(carrera => ({
      ...carrera,
      colorDeFondo: this.getColorAleatorio(),
      identificacionCorta: this.getIdentificacionCorta(carrera.identificacion)
    }));
  }

  private separateCarreras() {
    this.carrerasPadre = this.carreras.filter(carrera => !carrera.carreraPadreId);
    this.carrerasHijas = this.carreras.filter(carrera => carrera.carreraPadreId);
  }

  loadCarrerasActivas() {
    if (this.corredor) {
      this.registroCarreraService.getCarrerasActivas(this.corredor.id, 0, 1000).subscribe({
        next: (data: any) => this.registroCarreras = data.content,
        error: (error) => console.error('Error loading active carreras:', error)
      });
    }
  }

  getColorAleatorio(): string {
    return this.colores[Math.floor(Math.random() * this.colores.length)];
  }

  puedeInscribir(carrera: CarreraResponse): boolean {
    return !this.registroCarreras.some(registro => registro.carrera.id === carrera.id);
  }

  validarCapitan() {
    if (this.grupo) {
      this.corredorGrupo.getCapitan(this.grupo.id).subscribe({
        next: (data: CorredorGrupoResponse) => {
          this.esCapitan = this.corredor?.id === data.corredor.id;
          //console.log(this.esCapitan);
        },
        error: (error) => console.error('Error validando capitan:', error)
      });
    }
  }

  abrirEnlace(url: string) {
    window.open(url, '_blank');
  }
  /* Inscribirse en la carrea */

  async inscribirse(carrera: CarreraResponse, esGrupal: boolean) {
    const response: LoginResponse | null = this.sessionService.getUserData();
    if (response?.persona) {
      const alert = await this.createConfirmationAlert(carrera, esGrupal, response);
      await alert.present();
    }
  }

  private async createConfirmationAlert(carrera: CarreraResponse, esGrupal: boolean, response: LoginResponse) {
    return this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas inscribirte en esta carrera?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => console.log('Inscripción cancelada')
        },
        {
          text: 'Confirmar',
          handler: () => this.handleInscripcion(carrera, esGrupal, response)
        }
      ]
    });
  }

  private handleInscripcion(carrera: CarreraResponse, esGrupal: boolean, response: LoginResponse) {
    const registroData = this.createRegistroData(carrera, response);
    const inscripcionMethod = esGrupal ? this.registrarGrupo.bind(this) : this.registrarse.bind(this);
    inscripcionMethod(registroData);
  }

  private createRegistroData(carrera: CarreraResponse, response: LoginResponse): any {
    const registroData: any = {
      carreraId: carrera.id,
      corredorId: response.corredor.id,
      identificacion: carrera.identificacion
    };
    if (response.grupo) {
      registroData.grupoId = response.grupo.id;
    }
    return registroData;
  }

  private registrarGrupo(registroData: any) {
    this.registroCarreraService.registrarGrupo(registroData).subscribe({
      next: (data: RegistroCarreraResponseCreateGrupo) => {
        const mensajes = this.createRegistroMessages(data);
        this.presentToast(`Inscripción exitosa:\n\n${mensajes}`, true);
        this.refreshCarreras();
      },
      error: (error) => {
        this.presentToast('Error al inscribirse: ' + error.error, false);
      }
    });
  }

  private registrarse(registroData: any) {
    this.registroCarreraService.registrarse(registroData).subscribe({
      next: () => {
        this.presentToast('Inscripción exitosa', true);
        this.refreshCarreras();
      },
      error: (error: any) => {
        let errorMessage = 'Error al inscribirse: ';

        if (error.error && error.error.message) {
          // If the error object has a specific message from the server
          errorMessage = error.error.message;
        } else if (error.message) {
          // If it's a general error with a message property
          errorMessage = error.message;
        }

        this.presentToast(errorMessage, false);
        console.error('Error de inscripción:', error);
      }
    });
  }

  private createRegistroMessages(data: RegistroCarreraResponseCreateGrupo): string {
    return data.listadoRegistros.map(registro =>
      `Corredor: ${registro.corredor.persona.nombre} ${registro.corredor.persona.apellido}, Número de Registro: ${registro.numeroRegistro}`
    ).join('\n');
  }

  private refreshCarreras() {
    this.loadCarreras();
    this.loadCarrerasActivas();
  }

  getIdentificacionCorta(identificacion: string): string {
    const index = identificacion.indexOf('-');
    return index !== -1 ? identificacion.substring(0, index) : identificacion;
  }

  countCategoriasCarreras(identificacion: string): number {
    const carrerasFiltradas = this.carrerasHijas.filter(carrera =>
      carrera.identificacion.startsWith(this.getIdentificacionCorta(identificacion))
    );
    return carrerasFiltradas.length;
  }

  async openCarrerasHijasModal(carreraPadre: CarreraResponse) {
    const modal = await this.modalController.create({
      component: CarreraHijasModalComponent,
      componentProps: {
        carrerasHijas: this.carrerasHijas,
        registroCarreras: this.registroCarreras,
        identificacionCortaPadre: this.getIdentificacionCorta(carreraPadre.identificacion),
        esCapitan: this.esCapitan
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.inscribirse(result.data.carrera, result.data.esGrupal);
      }
    });

    return await modal.present();
  }

  async presentToast(message: string, result: boolean = true) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: result ? 'success' : 'danger'
    });
    toast.present();
  }

  async openModalDetalle(carreraResponse: CarreraResponse) {
    const modal = await this.modalController.create({
      component: DetalleCarreraComponent,
      componentProps: {
        carrera: carreraResponse,
        identificacionCorta: this.getIdentificacionCorta(carreraResponse.identificacion)
      },
    });
    modal.onWillDismiss().then((event) => this.onWillDismiss(event));
    await modal.present();
  }

  onWillDismiss(event: any) {
    this.refreshCarreras();
  }


}
