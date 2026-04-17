import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from "ionicons";
import { IonHeader, NavController } from "@ionic/angular/standalone";
import { IonicModule, ToastController } from '@ionic/angular';
import { LoginService } from '../../services/loginService/login.service';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { SessionService } from 'src/app/services/sessionService/session.service';
import { CommonModule } from '@angular/common';
import { logOutOutline, logInOutline, arrowBackOutline, personAddOutline,fitnessOutline } from "ionicons/icons";
import { LoginRequest } from '../../models/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [LoginService]
})
export class LoginComponent  implements OnInit {
  loginForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private loginService: LoginService,
    private navCtrl: NavController,
    private sessionService: SessionService,
    private toastController: ToastController
  ) {
    this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    }); 
    addIcons({logOutOutline,logInOutline,arrowBackOutline, personAddOutline, fitnessOutline});
}

  ngOnInit() {

  }


// Función separada para mostrar el toast
async presentToast(message: string, color: string = 'danger') {
  const toast = await this.toastController.create({
    message: message,
    duration: 3000,
    color: color,
    position: 'top'
  });
  toast.present();
}

async onSubmit() {
  if (this.loginForm.valid) {
    const loginRequest: LoginRequest = this.loginForm.value;

    // Llamada al servicio de login
    this.loginService.login(loginRequest).subscribe(
      async response => {
        // Si el login es exitoso, almacenamos los datos del usuario en la sesión
        this.sessionService.setUserData(response);
        // Navegamos al menú de usuario solo si el login es exitoso
        this.navCtrl.navigateForward('/menuUsuario');
      },
      async error => {
        // Manejo de errores del servidor
        let message = '';
        console.log(error)
        if (error.status === 400) {
          message = 'Credenciales incorrectas. Por favor, verifique su correo.';
        } else if (error.status === 401) {
          message = 'Credenciales incorrectas. Por favor, verifique su correo.';
        } else {
          message = 'Ocurrió un error inesperado. Por favor, intente más tarde.';
        }

        // Mostrar el mensaje de error con el toast
        this.presentToast(message);
      }
    );
  } else {
    // Si el formulario es inválido, mostrar mensaje de error
    this.presentToast('Debe ingresar un correo electrónico válido.');
  }
}

  routerLink(ruta: string) {
    this.navCtrl.navigateForward('/'+ruta);
  }
}
