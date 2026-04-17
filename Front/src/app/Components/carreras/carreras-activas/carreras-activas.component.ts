import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CarreraResponse } from 'src/app/models/carrera';
import { CorredorResponse } from 'src/app/models/corredor';
import { LoginResponse } from 'src/app/models/login';
import { RegistroCarreraResponse } from 'src/app/models/registroCarrera';
import { RegistroCarreraService } from 'src/app/services/registroCarreraService/registro-carrera.service';
import { SessionService } from 'src/app/services/sessionService/session.service';
import { DetalleCarreraComponent } from '../detalle-carrera/detalle-carrera.component';
import { AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-carreras-activas',
  templateUrl: './carreras-activas.component.html',
  styleUrls: ['./carreras-activas.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ],
  providers: [SessionService, RegistroCarreraService]
})
export class CarrerasActivasComponent  implements OnInit {
  corredor: CorredorResponse | null = null;
  registroCarreras: RegistroCarreraResponse[] = [];

  constructor(
    private sessionServices: SessionService,
    private registroCarreaService: RegistroCarreraService,
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    const response: LoginResponse | null = this.sessionServices.getUserData();
    if (response && response.persona) {
      this.corredor = response.corredor;
    }
    this.loadCarrerasActivas();
  }
  currentPage: number = 0;
  pageSize: number = 10;
  hasNext: boolean = true;
  loadCarrerasActivas() {
    this.registroCarreaService.getCarrerasActivas(this.corredor!.id,this.currentPage, this.pageSize).subscribe(
      (data: any) => {
        this.registroCarreras = data.content;
        this.hasNext = !data.last;
        this.currentPage++;
      },
      error => {
        console.log(error);
      }
    );
  }

  getIdentificacionCorta(identificacion: string): string {
    const index = identificacion.indexOf('-');
    return index !== -1 ? identificacion.substring(0, index) : identificacion;
  }
  
  salirCarrera(registroCarrera: RegistroCarreraResponse) {
    if (!this.corredor) {
      return;
    }
  
    // Mostrar alerta de confirmación
    this.presentConfirmAlert(registroCarrera);
  }
  
  // Método para mostrar la alerta de confirmación
  
// Método para mostrar la alerta de confirmación
async presentConfirmAlert(registroCarrera: RegistroCarreraResponse) {
  const alert = await this.alertController.create({
    header: 'Confirmar',
    message: '¿Está seguro de que quiere salir de la carrera?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log();
        }
      },
      {
        text: 'ok',
        handler: () => {
          // Verificación de que this.corredor y this.corredor.id no son nulos o indefinidos
          if (this.corredor?.id) {
            // Llamar al servicio para salir de la carrera
            this.registroCarreaService.salirCarrera(registroCarrera.id).subscribe(
              (data: any) => {
                // Filtrar el registro removido
                this.registroCarreras = this.registroCarreras.filter((registro: RegistroCarreraResponse) => registro.id !== registroCarrera.id);
                //this.loadCarrerasActivas();
              },
              error => {
                console.log(error);
              }
            );
          }
        }
      }
    ]
  }); 
  
    await alert.present();
  }
  /* Manejo de modals */
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
    const ev = event as CustomEvent<{ role: string; data: string }>;
   
  }
}
