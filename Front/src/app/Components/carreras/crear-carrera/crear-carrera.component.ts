import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CreateCarreraRequest } from 'src/app/models/carrera';
import { addIcons } from "ionicons";
import { IonicModule, ModalController } from '@ionic/angular';
import { CarreraService } from 'src/app/services/carreraService/carrera.service';

@Component({
  selector: 'app-crear-carrera',
  templateUrl: './crear-carrera.component.html',
  styleUrls: ['./crear-carrera.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    ReactiveFormsModule
  ],
  providers: [CarreraService]
})
export class CrearCarreraComponent  implements OnInit {
  carreraForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private carreraService: CarreraService
  ) { }

  ngOnInit() {
    this.carreraForm = this.formBuilder.group({
      nombreCarrera: ['', Validators.required],
      ubicacion: ['', Validators.required],
      responsable: ['', Validators.required],
      identificacion: ['', Validators.required],
      estado: [false, Validators.required],
      fechaCarrera: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.carreraForm.valid) {
      const createCarreraRequest: CreateCarreraRequest = this.carreraForm.value;
      this.carreraService.createCarrera(createCarreraRequest).subscribe((data: any) => {
        console.log();
      }
      );
      
    } else {
      console.log('Formulario no válido');
    }
  }
  closeModal() {
    this.modalController.dismiss(null, 'cancel');
  }
}
