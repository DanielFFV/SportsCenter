import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CarreraResponse } from 'src/app/models/carrera';
import { RegistroCarreraResponse } from 'src/app/models/registroCarrera';

@Component({
  selector: 'app-carrera-hijas-modal',
  templateUrl: './carrera-hijas-modal.component.html',
  styleUrls: ['./carrera-hijas-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  
})
export class CarreraHijasModalComponent implements OnInit {
  @Input() carrerasHijas: CarreraResponse[] = [];
  @Input() registroCarreras: RegistroCarreraResponse[] = [];
  @Input() identificacionCortaPadre: string = '';
  @Input() esCapitan: boolean = false;


  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.filterCarrerasHijas();
  }

  private filterCarrerasHijas() {
    this.carrerasHijas = this.carrerasHijas.filter(carrera => 
      carrera.identificacion?.startsWith(this.identificacionCortaPadre)
    );
  }

  inscribirseIndividual(carrera: CarreraResponse) {
    this.dismissModal({ carrera, esGrupal: false });
  }

  inscribirseGrupo(carrera: CarreraResponse) {
    this.dismissModal({ carrera, esGrupal: true });
  }

  puedeInscribir(carrera: CarreraResponse): boolean {
    return !this.registroCarreras.some(registro => registro.carrera.id === carrera.id);
  }

  estadoFechaInscripcion(carrera: any): boolean {
    const fechaActual = new Date();
    const fechaCierre = new Date(carrera.fechaCierreInscripciones);
    return fechaCierre >= fechaActual;
  }

  dismissModal(data?: any) {
    this.modalController.dismiss(data);
  }
}