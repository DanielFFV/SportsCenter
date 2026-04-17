import { Component, OnInit } from '@angular/core';
import { LoginResponse } from 'src/app/models/login';
import { PersonaResponse } from 'src/app/models/persona';
import { SessionService } from 'src/app/services/sessionService/session.service';
import { IonCard } from "@ionic/angular/standalone";
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
  ],
  providers: [
  ]
})
export class PerfilUsuarioComponent  implements OnInit {
  persona: PersonaResponse | null = null;
  constructor(
    private sessionService: SessionService,

  ) { }


  ngOnInit() {
    const response: LoginResponse | null = this.sessionService.getUserData();
    if (response && response.persona) {
      this.persona = response.persona; // Actualiza userData con los datos de persona
    } else {
      console.log("No se encontró la información de la persona.");
    }
  }

}
