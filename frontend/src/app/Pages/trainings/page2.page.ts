import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Tuodaan tarvittavat Ionic-komponentit standalone-moduuleista
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonAccordionGroup,
  IonAccordion,
  IonButton,
  AlertController // Tarvitaan varoitusikkunoiden luomiseen
} from '@ionic/angular/standalone';

// Tuodaan ikonit ja niiden rekisteröintifunktio
import { addIcons } from 'ionicons';
import { add, trashOutline } from 'ionicons/icons';

/**
 * Rajapinnat (Interfaces) määrittelevät datan rakenteen.
 * Tämä auttaa TypeScriptiä huomaamaan virheet, jos yritämme käyttää dataa väärin.
 */
interface Exercise {
  name: string;
  isSelected: boolean;
  reps?: number;
  sets?: number;
  weight?: number;
}

interface WorkoutProgram {
  id: number;
  name: string;
  exercises: Exercise[];
  date: string;
}

@Component({
  selector: 'app-page2',
  templateUrl: './page2.page.html',
  styleUrls: ['./page2.page.scss'],
  standalone: true,
  // Rekisteröidään HTML-puolella käytettävät komponentit
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,
    FormsModule, IonButtons, IonMenuButton, IonFab, IonFabButton,
    IonIcon, IonList, IonItem, IonLabel, IonAccordionGroup,
    IonAccordion, IonButton
  ],
})
export class Page2Page implements OnInit {
  private http = inject(HttpClient);
  savedPrograms: WorkoutProgram[] = [];
  testData: any;


  /**
   * Konstruktori: Ajetaan, kun sivu luodaan.
   * Injektoidaan Router navigointia varten ja AlertController ikkunoita varten.
   */
  constructor(
    private router: Router, 
    private alertCtrl: AlertController
  ) {
    // Rekisteröidään ikonit, jotta ne voidaan näyttää <ion-icon>-tageilla
    addIcons({ add, trashOutline });
  }

  ngOnInit() {
    // Perus-Angular alustusmetodi
    try {
      // 1. Get the object from sessionStorage
      const sessionDataStr = sessionStorage.getItem('accesstoken');
      if (sessionDataStr) {
        const sessionData = JSON.parse(sessionDataStr);
        // 2. Use sessionData.googleId for the URL. Added backend port 3000.
        const url = `http://localhost:3000/api/users/${sessionData.googleId}`; 
        
        // 3. Use sessionData.token for the Authorization header
        this.http.get(url, {
          headers: {
            'Authorization': `Bearer ${sessionData.token}`, // Only the raw token string
            'Content-Type': 'application/json'
          }
        }).subscribe({
          next: (data) => {
            this.testData = data;
            console.log('Test data loaded:', this.testData);
          },
          error: (err) => {
            console.error('Failed to load test data', err);
          }
        });
      }
    } catch (error) {
      console.error('Error loading test data:', error);
    }
  }

  /**
   * Ionicin elinkaarimetodi, joka ajetaan aina, kun käyttäjä saapuu sivulle.
   * Tämä varmistaa, että uusin data haetaan muistista joka kerta.
   */
  ionViewWillEnter() {
    this.loadPrograms();
  }

  /**
   * Hakee tallennetut ohjelmat selaimen LocalStoragesta.
   */
  loadPrograms() {
    const data = localStorage.getItem('treeniohjelmat');
    if (data) {
      // Muunnetaan teksti takaisin JavaScript-olioiksi
      this.savedPrograms = JSON.parse(data) as WorkoutProgram[];
    }
  }

  /**
   * Poistaa treeniohjelman.
   * @param programId Poistettavan treenin uniikki ID
   * @param event Klikkaustapahtuma (tarvitaan haitarin avaamisen estämiseen)
   */
  async deleteProgram(programId: number, event: Event) {
    // Estetään klikkauksen kulku ylemmille elementeille (ei avata/suljeta haitaria)
    event.stopPropagation();

    // Luodaan vahvistusikkuna
    const alert = await this.alertCtrl.create({
      header: 'Poistetaanko treeni?',
      message: 'Haluatko varmasti poistaa tämän treeniohjelman? Toimintoa ei voi peruuttaa.',
      cssClass: 'custom-delete-alert', // Käytetään tyylittelyyn global.scss:ssä
      buttons: [
        {
          text: 'Peruuta',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          handler: () => {
            console.log('Poisto peruttu');
          }
        },
        {
          text: 'Poista',
          role: 'destructive', // Punainen sävy joissain käyttöjärjestelmissä
          cssClass: 'alert-button-confirm',
          handler: () => {
            // 1. Suodatetaan lista: pidetään kaikki muut paitsi poistettava ID
            this.savedPrograms = this.savedPrograms.filter(p => p.id !== programId);
            
            // 2. Päivitetään muuttunut lista takaisin selaimen muistiin tekstimuodossa
            localStorage.setItem('treeniohjelmat', JSON.stringify(this.savedPrograms));
          }
        }
      ]
    });

    // Näytetään ikkuna käyttäjälle
    await alert.present();
  }

  /**
   * Navigoi sivulle, jossa luodaan uusia ohjelmia.
   */
  lisaaOhjelma() {
    this.router.navigate(['/page4']);
  }
}