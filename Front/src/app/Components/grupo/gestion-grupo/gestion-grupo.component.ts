import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicModule, IonModal, ModalController, ToastController } from '@ionic/angular';
import { CorredorGrupoResponse } from 'src/app/models/corredorGrupo';
import { GrupoResponse } from 'src/app/models/grupo';
import { LoginResponse } from 'src/app/models/login';
import { CorredorGrupoService } from 'src/app/services/corredorGrupoService/corredor-grupo.service';
import { SessionService } from 'src/app/services/sessionService/session.service';
import { CrearGrupoComponent } from '../crear-grupo/crear-grupo.component';
import { GrupoService } from 'src/app/services/grupoService/grupo.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SolicitudService } from 'src/app/services/solicitudService/solicitud.service';
import { CreateSolicitudGrupo, SolicitudGrupo } from 'src/app/models/solicitudGrupo';
import { CorredorResponse } from 'src/app/models/corredor';

@Component({
  selector: 'app-gestion-grupo',
  templateUrl: './gestion-grupo.component.html',
  styleUrls: ['./gestion-grupo.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [SessionService, CorredorGrupoService, GrupoService,SolicitudService]
})
export class GestionGrupoComponent  implements OnInit {
  @ViewChild(IonModal) modal!: IonModal ;
  grupo !: GrupoResponse;
  grupoSearch: GrupoResponse | null = null;
  miembrosGrupo: CorredorGrupoResponse[] = [];
  solicitudesCorredor: SolicitudGrupo [] = [];
  nombreGrupo: string = '';
  corredorId:string = '';
  corredor:CorredorResponse | null = null;
  puestosDisponibles: number = 0;
  corredorCapitan: string = "";
  constructor(
    private sessionServices: SessionService,
    private corredorGrupoService: CorredorGrupoService,
    private modalController: ModalController,
    private grupoService: GrupoService,
    private solicitudService:SolicitudService,
    private toastController: ToastController,
    
  ) {
    const response: LoginResponse | null = this.sessionServices.getUserData();
    if (response) {
      this.grupo = response.grupo;
      this.corredor = response.corredor;
      this.corredorId = response.corredor.id;
      this.loadMiembrosGrupo();
      this.loadPeticiones();
    }
   }

  ngOnInit() {
    
    
  }
  loadMiembrosGrupo(){
    if(this.grupo !=null){
      this.corredorGrupoService.getMiembrosGrupo(this.grupo.id).subscribe(response => {
        this.miembrosGrupo = response.content;
      });
    }
   
  }
  loadPeticiones(){
    this.solicitudService.getPeticionesByCorredor(this.corredorId).subscribe(response => {
      this.solicitudesCorredor  =response.content;
    });
  }
  // para validar si se puede ver el boton de solicitar el grupo
  solicitoUnirse(grupo: GrupoResponse): boolean {
    return this.solicitudesCorredor.some(solicitud => solicitud.grupo.id === grupo.id);
  }

  findGrupo(nombre: string) {
    /////////////////////
    if (!this.nombreGrupo || this.nombreGrupo.trim() === '') {
      this.presentToast('El nombre del grupo esta vacio' , false);

    }else{
      this.grupoService.findByName(nombre).subscribe({
        next: (response) => {
          this.grupoSearch = response;  // Asignación de la respuesta a grupoSearch
          this.presentToast('Grupo encontrado exitosamente.', true);
          this.corredorGrupoService.getMiembrosGrupo(this.grupoSearch.id).subscribe({
            next: (response) => {
              this.puestosDisponibles = (this.grupoSearch?.cantidadCorredor ?? 0) - response.numberOfElements;
              if (response.content[0].capitan == true) {
                this.corredorCapitan = response.content[0].corredor.persona.nombre + " " + response.content[0].corredor.persona.apellido;
              } else {
                this.corredorCapitan = "";
              }
            },
            error: (error) =>{
              console.error('Error al buscar el grupo:', error);
              this.grupoSearch = null; 
              this.presentToast( error.error, false);
            }
          });
        },
        error: (error) => {
          console.error('Error al buscar el grupo:', error);
          this.grupoSearch = null; 
          this.presentToast( error.error, false);
        }
      });
  
    }
  }
  /* Gestion de modals */
  async openModalCrearGrupo() {
    const modal = await this.modalController.create({
        component: CrearGrupoComponent,  
        componentProps: {
          idCorredor: this.corredorId
        },
        
      });
  
      modal.onWillDismiss().then((event) => this.onWillDismiss(event));
      await modal.present();
    }

    onWillDismiss(event: any) {
        if (event.role === 'created') {
          // Captura el grupo creado
          const grupoCreado: GrupoResponse = event.data;
    
          // Actualiza la página o lista de grupos
          this.refreshPage(grupoCreado);
        } else {
          console.log('El modal fue cancelado o no se creó ningún grupo.');
        }
      

    }

    refreshPage(grupo: GrupoResponse) {
      if(grupo != null){
        this.grupo = grupo;
        this.sessionServices.replaceUserGroup(grupo);
        this.loadMiembrosGrupo();
      }
      

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
    
    crearSolicitud(grupo: GrupoResponse){
      if(this.corredor != null){
        let createRegistroGrupo: CreateSolicitudGrupo ={
          corredorId: this.corredorId,
          grupoId: grupo.id
        }
        this.solicitudService.saveSolicitudGrupo(createRegistroGrupo).subscribe(
          (response: SolicitudGrupo) => {
            this.presentToast(`Petición exitosa`, true);
            this.loadPeticiones();
          },
          (error:any) => {
            this.presentToast(error.error,false);
          }
        )
      }
      
    }
}
