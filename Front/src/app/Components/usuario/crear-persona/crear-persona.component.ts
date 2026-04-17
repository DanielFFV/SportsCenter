import { CommonModule, formatDate } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, SecurityContext } from '@angular/core';
import { empty, finalize, Subject, takeUntil } from 'rxjs';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { ToastController } from '@ionic/angular/standalone';
import { CreatePersonaRequest, PersonaResponse } from 'src/app/models/persona';
import { TipoDocumentoResponse } from 'src/app/models/TipoDocumento';
import { PersonaService } from 'src/app/services/personaService/persona.service';
import { TipoDocService } from 'src/app/services/tipoDocService/tipo-doc.service';
import { CorredorService } from 'src/app/services/corredorService/corredor.service';
import { CorredorResponse } from 'src/app/models/corredor';
import { addIcons } from 'ionicons';
import { closeOutline, person, personAddOutline, saveOutline, text } from 'ionicons/icons';
import { EpsService } from 'src/app/services/epsService/eps.service';
import { EpsResponse } from 'src/app/models/eps';
import { DocumentosService } from 'src/app/services/documentosService/documentos.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { FileOpener } from '@ionic-native/file-opener/ngx';


@Component({
  selector: 'app-crear-persona',
  templateUrl: './crear-persona.component.html',
  styleUrls: ['./crear-persona.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [TipoDocService, PersonaService, CorredorService, EpsService, DocumentosService]
})
export class CrearPersonaComponent  implements OnInit {
  tipoDocument: TipoDocumentoResponse[] = [];
  listaEPS: EpsResponse[] = [];
  corredorData?: CorredorResponse;
  documentUrl?: SafeResourceUrl;
  errorMessageCorredor: string = '';
  isLoadingCorredor: boolean = false;
  personaForm: FormGroup;
  private destroy$ = new Subject<void>();
  // corredor?: CorredorResponse;
  nombreResponsable: string = "";
  apellidoResponsable: string = "";
  tallasCamiseta: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  listaRH: string[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  maxDate: string;
  minValidDate: Date;
  menorEdad: boolean = false;
  isModalOpen = false;
  contenidoModal: string = "";
  tituloModal: string = "";
  modalText: string[] = ['terminos','politicas', 'vacio'];
  textModalData: string = "";
  documentPatterns: any = {
    'Cédula de Ciudadanía': /^[0-9]{8,10}$/,
    'Tarjeta de Identidad': /^[0-9]{8,10}$/,
    'Pasaporte': /^[a-zA-Z]{2,3}[0-9]{6}$/
  };
  selectedDocumentType: string = 'Cédula de Ciudadanía';
  documentNumber: string = '';
  isValidDocument: boolean = false;
  currentPage: number = 1;

  constructor(
    private fb: FormBuilder,
    private tipoDocService: TipoDocService,
    private epsService: EpsService,
    private personaService: PersonaService,
    private corredor: CorredorService,
    private sanitizer: DomSanitizer,
    private documentService: DocumentosService,
    private navCtrl: NavController,
    private toastController: ToastController,
    public platform: Platform,
    // private fileOpener: FileOpener
  ) {
    addIcons({ closeOutline, personAddOutline, saveOutline });
    this.personaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]*$')]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]*$')]],
      fechaNacimiento: ['', [Validators.required, this.dateValidator.bind(this)]],
      documento: ['', []],
      tipoDocumentoId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.emailValidator()]],
      celular: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      direccion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100), this.direccionValidator(), 
        this.estructuraDireccionValidator()]],
      genero: ['', Validators.required],
      tallaCamiseta: ['', Validators.required],
      eps: ['', Validators.required],
      rh: ['', Validators.required],
      aceptaTerminos: [false, Validators.requiredTrue],
      aceptaPoliticas: [false, Validators.requiredTrue],
      documentoResponsable: ['', []],
      corredorResponsableId: ['', []],
      password: ['', [Validators.required, Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), this.passwordMatchValidator]]
    });

    this.maxDate = new Date().toISOString();
    this.minValidDate = this.restarAnios(new Date(), 7);
    this.personaForm.get('password')?.valueChanges.subscribe(() => {
      const confirmPasswordControl = this.personaForm.get('confirmPassword');
      confirmPasswordControl?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.loadTipoDocumentos();
    this.loadEps();
  }

  loadTipoDocumentos(): void {
    this.tipoDocService.getTipoDocumentos().subscribe(
      (data: any) => {
        // Procesar los datos de la respuesta para extraer 'content'
        this.tipoDocument = data.content;
      },
      (error) => {
        console.error('Error al cargar los tipos de documento', error);
      }
    );
  }

  loadEps(): void {
    this.epsService.getAllRecords().subscribe({
      next: (records: EpsResponse[]) => {
        this.listaEPS = records;
        // console.log(this.listaEPS);
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        // Opcional: mostrar un mensaje de error al usuario
        this.presentToast('No se pudieron cargar las EPS');
      }
    });
  }

  mostrarTerminos() {
    this.documentUrl = this.documentService.getTerminosCondiciones();
    this.tituloModal = 'Términos y Condiciones';
    this.isModalOpen = true;
    console.log(this.platform);

  }

  mostrarPoliticaDatos() {
    this.documentUrl = this.documentService.getPoliticaDatos();
    this.tituloModal = 'Política de Datos';
    this.isModalOpen = true;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  abrirPDFMovil() {
    if (this.documentUrl) {
      const urlString = this.sanitizer.sanitize(
        SecurityContext.URL, 
        this.documentUrl
      );

      if (urlString) {
        window.open(urlString, '_blank');
      } else {
        console.error('URL no válida');
        this.presentToast('No se puede abrir el documento');
        return;
      }

    } else {
      console.error('Documento URL no definida');
      this.presentToast('Documento no disponible');
      return;
    }
  }

  restarAnios(fecha: Date, anios: number): Date {
    const nuevaFecha = new Date(fecha); // Crea una nueva instancia de la fecha para evitar modificar la original
    nuevaFecha.setFullYear(nuevaFecha.getFullYear() - anios);
    return nuevaFecha;
  }

  onFechaNacimientoChange(event: any) {
    const fechaSeleccionada = new Date(event.detail.value);
    console.log('Fecha de nacimiento seleccionada:', fechaSeleccionada);
    
    // Añadir o remover validadores basados en la edad
    const docResponsableCtrl = this.personaForm.get('documentoResponsable');
    const corredorResponsableIdCtrl = this.personaForm.get('corredorResponsableId');

    // Aquí podrías realizar cualquier validación adicional o acción
    if (fechaSeleccionada < this.minValidDate) {
      console.log('La fecha de nacimiento es válida.');
      this.personaForm.get('fechaNacimiento')?.setErrors(null);
    } else {
      console.log('La fecha de nacimiento debe ser anterior a ', this.minValidDate);
      this.personaForm.get('fechaNacimiento')?.setErrors({ 'invalidDate': true });
    }

    if (fechaSeleccionada < this.restarAnios(new Date(), 17)){
      this.menorEdad = false;
      console.log('El usuario es mayor de edad.');
      docResponsableCtrl?.clearValidators();
      corredorResponsableIdCtrl?.clearValidators();
    } else {
      this.menorEdad = true;
      console.log('El usuario es menor de edad.');
      docResponsableCtrl?.setValidators([Validators.required]);
      corredorResponsableIdCtrl?.setValidators([Validators.required]);
    }

    docResponsableCtrl?.updateValueAndValidity();
    corredorResponsableIdCtrl?.updateValueAndValidity();
  }

  private dateValidator(control: AbstractControl): {[key: string]: any} | null {
    const inputDate = new Date(control.value);
    console.log('fecha seleccionada: ', inputDate);
    return inputDate >= this.minValidDate ? { 'futureDate': true } : null;
  }

  emailValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      // Expresión que valida: { Texto antes del @ && Texto después del @ && Un punto && Dominio final (2-adelante caracteres) }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
      
      const valid = emailRegex.test(control.value);
      return valid ? null : {'invalidEmail': {value: control.value}};
    };
  }

  direccionValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      // Permite letras, números, espacios, #, -, y algunos caracteres comunes en direcciones
      const direccionRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s#\-.,°]+$/;
      
      const valid = direccionRegex.test(control.value);
      return valid ? null : {'invalidDireccion': {value: control.value}};
    };
  }

  estructuraDireccionValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      // Ejemplos de formatos válidos: { Calle 10 # 25-30 | Carrera 45 No 67 - 89 | Avenida Siempre Viva 742 }
      const direccionRegex = /^(Calle|Carrera|Avenida|Diagonal|Transversal|Perimetral)\s+\d+\s*([a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]*)\s*(#\s*\d+)?\s*([a-zA-Z]{0,3})?\s*(-\s*\d+)?(,\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+)?$/i;

      const valid = direccionRegex.test(control.value);
      return valid ? null : {'formatoDireccion': {value: control.value}};
    };
  }

  validateDocumentInRealTime() {
    const selectedType = this.tipoDocument.find(tipo => tipo.id === this.selectedDocumentType);

    if (selectedType) {
      const pattern = this.documentPatterns[selectedType.nombre];

      if (pattern) this.isValidDocument = pattern.test(this.documentNumber);
      this.documentNumber = this.documentNumber.toUpperCase();
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const form = control.parent;
    
    if (form) {
      const password = form.get('password');
      const confirmPassword = control;

      // Compara las contraseñas solo si ambas tienen valor
      if (password && confirmPassword && 
          password.value !== confirmPassword.value) {
        return { passwordMismatch: true };
      }
    }
    
    return null;
  }

  textInModal(selection: string){
    console.log('Texto seleccionado en el modal:', selection);
    if (selection == "terminos") {
      this.textModalData = "Terminos y condicones.";
    } else if (selection == "politicas") {
      this.textModalData = "Politica de tratamiento de datos";
    } else {
      this.textModalData = "";
    }
  }

  onSubmit() {
    if (this.personaForm.valid) {
      const persona: CreatePersonaRequest = this.personaForm.value;
      this.personaService.createPersona(persona).subscribe(
        (data: PersonaResponse) => {
          this.presentToast('Persona creada con éxito', 'success'); // Toast de éxito
          this.navCtrl.navigateForward('/home');
        },
        (error) => {
          if (error.error && error.error) {
            // console.log(error.error);

            const validationErrors = error.error;

            var msg: string = "";
            var cont = 1;
        
            // Iterar sobre los errores y agregarlos al arreglo
            Object.keys(validationErrors).forEach(key => {
              const errorMessage = validationErrors[key];

              msg += '\n' + String(cont) + ". " + errorMessage;
              cont++;
            });
        
            this.presentToast(msg);
            
          } else {
            this.presentToast('Error inesperado al crear la persona'); // Mensaje de error genérico
          }

          console.error('Error al crear la persona', error);
        }
      );
    } else {
      this.markFormGroupTouched(this.personaForm);
      this.presentToast('Por favor completa los campos requeridos.', "warning");
      return;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private async presentToast(
    message: string, 
    color: 'success' | 'danger' | 'warning' = 'danger',
    duration: number = 3500
  ): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position: 'top',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  routerToHome() {
    this.navCtrl.navigateForward('/home');
  }

  /**
 * Consulta y valida un corredor por número de documento
 * @param documento Número de documento del corredor responsable
 */
  documentoResponsable(documento: string) {
    this.errorMessageCorredor = '';
    this.corredorData = undefined;

    if (!documento?.trim()) {
      this.presentToast('Por favor ingrese un documento válido',"warning");
      this.personaForm.get('documentoResponsable')?.setErrors({ 'required': true });
      return;
    }

    // Activar loading
    this.isLoadingCorredor = true;

    this.corredor.getCorredorByDocumento(documento)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoadingCorredor = false;
        })
      )
      .subscribe({
        next: (data: CorredorResponse) => {
          this.corredorData = data;

          this.personaForm.patchValue({
            corredorResponsableId: this.corredorData.id
          });

          console.log(this.personaForm);

          this.presentToast(
            `Corredor ${data.persona.nombre} ${data.persona.apellido} encontrado`,
            'success'
          );

          console.log('Datos del corredor actualizados:', this.corredorData.id);

        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al cargar el corredor:', error);
          let mensajeError = 'Error al cargar el corredor. ';
  
          if (error.status === 404) {
            mensajeError = 'No se encontró un corredor con ese documento.';
          } else if (error.error?.message) {
            mensajeError += error.error.message;
          } else {
            mensajeError += 'Por favor intente nuevamente.';
          }

          // Actualizar estado de error
          this.errorMessageCorredor = mensajeError;
          this.presentToast(mensajeError);
          
          // Limpiar datos del corredor
          this.corredorData = undefined;
          this.personaForm.patchValue({
            corredorResponsableId: ''
          });
        }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}