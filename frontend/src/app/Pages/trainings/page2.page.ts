import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { XpService } from '../../xp.service';
import { AccordionGroupCustomEvent } from '@ionic/core';

import {
  IonContent,
  IonHeader,
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
  IonProgressBar,
  AlertController,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
// Lisätty 'play' ikoneihin navigointia varten
import { add, trashOutline, play } from 'ionicons/icons';
import { TrainingProgram, UserData } from '../../types/userdata';
import { DataFetchService } from '../../data-fetch-service';

@Component({
  selector: 'app-page2',
  templateUrl: './page2.page.html',
  styleUrls: ['./page2.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
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
    IonProgressBar,
    AsyncPipe,
  ],
})
export class Page2Page implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  public xpService = inject(XpService);
  private dataFetchService = inject(DataFetchService);

  savedPrograms: TrainingProgram[] = [];
  testData!: UserData;
  isAccordionOpen = false;

  constructor() {
    // Lisätty play-ikoni, jotta se näkyy HTML-puolella
    addIcons({ add, trashOutline, play });
  }

  ngOnInit() {
    // Perus-Angular alustusmetodi
  }

  /**
   * Ohjaa käyttäjän treenisivulle ja välittää valitun ohjelman tiedot
   */
  startProgram(program: TrainingProgram) {
    console.log('Aloitetaan treeni:', program.name);

    // Navigoidaan sivulle, joka hoitaa treenin suorituksen.
    // Varmista, että reitti (esim. '/page3') on oikein app.routes.ts -tiedostossa.
    this.router.navigate(['/page5'], {
      state: { activeWorkout: program },
    });
  }

  // Kun Trainings-sivu on tulossa näkyviin haetaan käyttäjän datat backendistä
  ionViewWillEnter() {
    try {
      const sessionDataString = sessionStorage.getItem('accesstoken');
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);
        this.dataFetchService.getUserDataById(sessionData.googleId).subscribe({
          next: (data) => {
            this.testData = data as UserData;
            console.log('Test data loaded:', this.testData);
            this.loadPrograms();
          },
          error: (err) => {
            console.error('Failed to load test data', err);
          },
        });
      }
    } catch (error) {
      console.error('Error loading test data:', error);
    }
  }

  loadPrograms() {
    const data = this.testData?.trainingPrograms;
    if (data) {
      this.savedPrograms = data;
    }
  }

  async deleteProgram(programId: string, event: Event) {
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Poistetaanko treeni?',
      message: 'Haluatko varmasti poistaa tämän treeniohjelman?',
      buttons: [
        { text: 'Peruuta', role: 'cancel' },
        {
          text: 'Poista',
          role: 'destructive',
          handler: () => {
            this.savedPrograms = this.savedPrograms.filter(
              (p) => p._id !== programId,
            );
            // Huom: Tämä päivittää vain localStoragen, muista päivittää backend myöhemmin
            localStorage.setItem(
              'treeniohjelmat',
              JSON.stringify(this.savedPrograms),
            );
          },
        },
      ],
    });
    await alert.present();
  }

  onAccordionChange(event: AccordionGroupCustomEvent) {
    // Jos event.detail.value on olemassa, jokin haitari on auki
    this.isAccordionOpen = !!event.detail.value;
  }

  lisaaOhjelma() {
    this.router.navigate(['/page4']);
  }
}
