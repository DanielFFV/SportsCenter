import { Component, OnInit, OnDestroy, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { IonicModule, IonContent, ModalController } from '@ionic/angular';
import { IonTitle, IonListHeader, IonCardHeader, IonCardTitle, IonCardContent, IonInfiniteScroll, IonInfiniteScrollContent,
  NavController} from '@ionic/angular/standalone';
import { CarreraService } from '../../services/carreraService/carrera.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { addIcons } from "ionicons";
import { logOutOutline, logInOutline, arrowBackOutline, personAddOutline, locationOutline, calendarOutline, speedometerOutline, trendingUpOutline, peopleOutline, 
  fitnessOutline, logoFacebook, logoInstagram, logoTwitter, logoWhatsapp, trophyOutline, playCircleOutline, homeOutline, arrowForwardOutline, 
  cardOutline } from "ionicons/icons";
import { CarreraResponse } from 'src/app/models/carrera';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/services/sessionService/session.service';
import { LoginResponse } from 'src/app/models/login';
import { PersonaResponse } from 'src/app/models/persona';
import { DetalleCarreraComponent } from '../carreras/detalle-carrera/detalle-carrera.component';

registerLocaleData(localeEs);

interface Recomendation {
  id: number;
  categoria: string;
  titulo: string;
  descripcion: string;
  imagen?: string;
  videoUrl?: string;
  url?: string;
}

interface Section {
  id: string;
  name: string;
  icon: string;
}

interface Sponsor {
  name: string;
  logo: string;
  url: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [ IonicModule, IonInfiniteScrollContent, IonInfiniteScroll, CommonModule, HttpClientModule, 
    IonTitle, IonListHeader, IonCardHeader, IonCardTitle, IonCardContent
  ],
  providers: [CarreraService, SessionService]
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(IonContent) content!: IonContent;
  @ViewChild('trackRef') trackRef!: ElementRef;

  userData: PersonaResponse | null = null;

  carreras: CarreraResponse[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  hasNext: boolean = true;
  colores: string[] = environment.colores;
  displaySponsors: Sponsor[] = [];
  currentIndex = 0;
  centerIndex: number = 0;
  private animationFrame: number = 0;
  private lastTimestamp: number = 0;
  private readonly SCROLL_SPEED = 0.05; // pixels per millisecond
  getColorAleatorio(): string {
    return this.colores[Math.floor(Math.random() * this.colores.length)];
  }

  recomendationItems: Recomendation[] = [
    {
      id: 1,
      categoria: 'Consejos de Entrenamiento',
      titulo: 'Cómo mejorar tu resistencia',
      descripcion: 'Descubre técnicas efectivas para aumentar tu resistencia en carreras de larga distancia. ',
      imagen: 'https://i.blogs.es/9cd75b/stage-7-photography-gaod3jrpxgs-unsplash/1366_2000.jpg',
    },
    {
      id: 2,
      categoria: 'Nutrición',
      titulo: 'Alimentos para corredores',
      descripcion: 'Los mejores alimentos para mantener tu energía durante las carreras de trail.',
      imagen: 'https://th.bing.com/th/id/OIP.4QK9XoPEm4snv4hf4Qs2cgHaDp?rs=1&pid=ImgDetMain',
    },
    {
      id: 3,
      categoria: 'Equipo',
      titulo: 'Elige los mejores zapatos de trail',
      descripcion: 'Guía para seleccionar las zapatillas adecuadas según el tipo de terreno.',
      imagen: 'https://thetribeconcept.com/blog/wp-content/uploads/2020/01/portada2.jpg',
    },
    {
      id: 4,
      categoria: 'Video Tutorial',
      titulo: 'Técnica de carrera en descenso',
      descripcion: 'Aprende a correr de forma segura y eficiente en descensos técnicos.',
      videoUrl: 'https://youtu.be/dQw4w9WgXcQ?si=G-e1b5DvfhxaEf7t',
    },
    {
      id: 5,
      categoria: 'Salud',
      titulo: 'Prevención de lesiones en trail running',
      descripcion: 'Consejos para evitar lesiones comunes y mantener tu cuerpo en óptimas condiciones.',
      imagen: 'assets/images/prevencion.jpg',
    }
  ];

  sections: Section[] = [
    { id: 'hero', name: 'Inicio', icon: 'home-outline' },
    { id: 'features', name: 'Características', icon: 'trophy-outline' },
    { id: 'sponsors', name: 'Patrocinadores', icon: 'people-outline' },
    { id: 'recommendations', name: 'Recomendaciones', icon: 'fitness-outline' },
    { id: 'races', name: 'Carreras', icon: 'calendar-outline' }
  ];

  sponsors: Sponsor[] = [
    { name: 'Key Global', logo: 'assets/sponsors/KeyGlobal.png', url: 'https://www.instagram.com/keyglobal_/' },
    { name: 'Sponsor 1', logo: 'https://getfullyfunded.com/wp-content/uploads/2019/02/sponsors-small.jpg', 
      url: 'https://getfullyfunded.com/wp-content/uploads/2019/02/sponsors-small.jpg' },
    { name: 'Sponsor 2', logo: 'assets/sponsors/Logo1.png', url: '' },
    // { name: 'Sponsor 3', logo: 'assets/sponsors/Logo2.png', url: '' }
    // ... más patrocinadores
  ];

  activeSection: string = 'hero';
  isNavbarVisible: boolean = false;
  lastScrollTop: number = 0;

  constructor(
    private carreraService: CarreraService,
    private navCtrl: NavController,
    private sessionService: SessionService,
    private modalController: ModalController,
    @Inject(LOCALE_ID) public locale: string
  ) {
      addIcons({logOutOutline,logInOutline,arrowBackOutline,personAddOutline,locationOutline,calendarOutline,speedometerOutline,trendingUpOutline,peopleOutline,
        fitnessOutline, logoFacebook, logoInstagram, logoTwitter, logoWhatsapp, trophyOutline, playCircleOutline, homeOutline, arrowForwardOutline, cardOutline });
        this.displaySponsors = [...this.sponsors, ...this.sponsors];
    }

  ngOnInit() {
    this.loadCarreras();
    this.sessionService.clearUserData();
    this.startAnimation();
  }

  ngAfterViewInit() {
    // Aseguramos que hay suficientes elementos para hacer scroll
    if (this.sponsors.length < 5) {
      this.displaySponsors = [...this.sponsors, ...this.sponsors, ...this.sponsors];
    }
  }

  loadCarreras() {
    this.carreraService.getCarreras(this.currentPage, this.pageSize).subscribe((data: any) => {
      const carrerasConColores = data.content.map((carrera: any) => ({
        ...carrera,
        colorDeFondo: this.getColorAleatorio()
      }));
      this.carreras = this.carreras.concat(carrerasConColores);
      this.hasNext = !data.last;
      this.currentPage++;
    });
  }

  getIdentificacionCorta(identificacion: string): string {
    const index = identificacion.indexOf('-');
    return index !== -1 ? identificacion.substring(0, index) : identificacion;
  }

  loadMore(event: any) {
    if (this.hasNext) {
      this.currentPage++;
      this.loadCarreras();
      event.target.complete();
    } else {
      event.target.disabled = true;
    }
  }
  routerLink(ruta: string) {
    this.navCtrl.navigateForward('/'+ruta);
  }

  async openModalDetalle(carreraResponse: CarreraResponse) {
    const modal = await this.modalController.create({
      component: DetalleCarreraComponent,  
      componentProps: { carrera: carreraResponse,
        identificacionCorta: this.getIdentificacionCorta(carreraResponse.identificacion),
        home: true},
        showBackdrop: true,
        // backdropDismiss: true,
        animated: true,
    });
    modal.onWillDismiss().then((event) => this.onWillDismiss(event));
    await modal.present();
  }

  async scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      await this.content.scrollToPoint(0, element.offsetTop, 500);
    }
  }

  onScroll(event: any) {
    // Get current scroll position
    const scrollTop = event.detail.scrollTop;
    
    // Show/hide navbar based on scroll direction
    this.isNavbarVisible = scrollTop > this.lastScrollTop && scrollTop > 100;
    this.lastScrollTop = scrollTop;

    // Update active section based on scroll position
    this.updateActiveSection();
  }

  private updateActiveSection() {
    for (const section of this.sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          this.activeSection = section.id;
          break;
        }
      }
    }
  }

  onNext() {
    this.currentIndex = (this.currentIndex + 1) % this.sponsors.length;
  }

  onPrevious() {
    this.currentIndex = (this.currentIndex - 1 + this.sponsors.length) % this.sponsors.length;
  }

  onWillDismiss(event: any) {
    this.loadCarreras();
    this.sessionService.clearUserData();
  }
  
  abrirEnlace(url: string) {
    window.open(url, '_blank');
  }

  ngOnDestroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private startAnimation() {
    const animate = (timestamp: number) => {
      if (!this.lastTimestamp) {
        this.lastTimestamp = timestamp;
      }
      
      const elapsed = timestamp - this.lastTimestamp;
      const track = this.trackRef.nativeElement;
      const scrollAmount = elapsed * this.SCROLL_SPEED;
      
      // Aplicar scroll
      track.style.transform = `translateX(-${scrollAmount}px)`;
      
      // Reset cuando el primer set completo ha pasado
      const firstSetWidth = (track.children[0].offsetWidth + 64/*32*/) * this.sponsors.length;
      if (scrollAmount >= firstSetWidth) {
        this.lastTimestamp = timestamp;
        track.style.transform = 'translateX(0)';
      }
      
      // Actualizar índice central
      const itemWidth = track.children[0].offsetWidth + 64/*32*/; // width + gap
      this.centerIndex = Math.floor((scrollAmount % firstSetWidth) / itemWidth);
      
      this.animationFrame = requestAnimationFrame(animate);
    };
    
    this.animationFrame = requestAnimationFrame(animate);
  }
}

