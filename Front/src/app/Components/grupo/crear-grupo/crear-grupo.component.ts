import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { CreateGrupoRequest, GrupoResponse } from 'src/app/models/grupo';
import { GrupoService } from 'src/app/services/grupoService/grupo.service';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-crear-grupo',
  templateUrl: './crear-grupo.component.html',
  styleUrls: ['./crear-grupo.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  providers: [GrupoService]
})
export class CrearGrupoComponent implements OnInit {
  grupoForm: FormGroup;
  idCorredor: string = '';
  isSubmitting = false;
  private destroy$ = new Subject<void>();
  nombreExistente: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private grupoService: GrupoService,
    private modalController: ModalController,
    private toastController: ToastController,
    private grupo: GrupoService,
    private navParams: NavParams
  ) {
    addIcons({
      closeOutline
    });
    this.grupoForm = this.formBuilder.group({
      nombre: ['', { validators: [Validators.required, Validators.minLength(3), this.nombreValidator.bind(this)], updateOn: 'blur'}],
      cantidadCorredor: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.idCorredor = this.navParams.get('idCorredor');
    if (!this.idCorredor) {
      this.presentToast('Error: ID del corredor no proporcionado', false);
      this.closeModal();
    }
  }

  onSubmit() {
    if (this.grupoForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const createGrupoRequest: CreateGrupoRequest = {
        ...this.grupoForm.value,
        corredorCreador: this.idCorredor,
        fechaCreacion: new Date().toISOString() // Use ISO 8601 format
      };

      this.grupoService.postGrupo(createGrupoRequest).pipe(
        catchError((error) => {
          console.error('Error al crear el grupo:', error);
          this.handleError(error);
          return throwError(() => error);
        }),
        finalize(() => this.isSubmitting = false)
      ).subscribe({
        next: (response) => {
          this.presentToast('Grupo creado exitosamente.', true);
          this.modalController.dismiss(response, 'created');
        }
      });
    } else if (!this.grupoForm.valid) {
      this.presentToast('Por favor, complete todos los campos correctamente.', false);
    }
  }

  closeModal() {
    this.modalController.dismiss(null, 'cancel');
  }

  private async presentToast(message: string, isSuccess: boolean = true) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: isSuccess ? 'success' : 'danger'
    });
    toast.present();
  }

  private handleError(error: any) {
    let errorMessage = 'Ocurrió un error al crear el grupo.';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 400) {
      // Bad request
      errorMessage = 'Los datos proporcionados no son válidos. Por favor, revise la información.';
    } else if (error.status === 409) {
      // Conflict (e.g., group name already exists)
      errorMessage = 'Ya existe un grupo con ese nombre. Por favor, elija otro nombre.';
    } else if (error.status === 404) {
      // Not found (e.g., corredor not found)
      errorMessage = 'No se encontró el corredor especificado.';
    } else if (error.status === 500) {
      // Server error
      errorMessage = 'Error en el servidor. Por favor, intente más tarde.';
    }
    errorMessage += " " + error.error;
    this.presentToast(errorMessage, false);
  }

  private nombreValidator(control: AbstractControl): ValidationErrors | null {
    if (this.nombreExistente) {
      return { grupoExistente: true };
    }
    return null;
  }

/**
 * Consulta y valida un grupo de acuerdo al nombre
 * @param nombre Nombre del grupo 
 */
grupoExistente(nombre: string) {
  if (!nombre?.trim()) {
    this.presentToast('Por favor ingrese un nombre válido', false);
    this.grupoForm.get('nombre')?.setErrors({ 'required': true });
    return;
  }

  this.grupo.findByName(nombre)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (data: GrupoResponse) => {
        this.nombreExistente = true;
        this.grupoForm.get('nombre')?.setErrors({ grupoExistente: true });
        this.presentToast(`Grupo "${data.nombre}" encontrado`, false);
      },
      error: (error: HttpErrorResponse) => {
        this.nombreExistente = false;
        this.grupoForm.get('nombre')?.setErrors(null);

        if (error.status === 404) {
          this.presentToast('No se encontró un grupo con ese nombre.');
        } else {
          this.presentToast('Error al verificar el nombre del grupo.');
        }
      }
    });
}

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
}