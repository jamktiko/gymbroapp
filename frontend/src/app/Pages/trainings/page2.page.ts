/**
 * Trainings-näkymä
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { XpService } from '../../xp.service';
import { AccordionGroupCustomEvent, ItemReorderEventDetail } from '@ionic/core';
import { addIcons } from 'ionicons';
import { add, trashOutline, play, reorderTwoOutline } from 'ionicons/icons';
import { TrainingProgram, UserData } from '../../types/userdata';
import { DataFetchService } from '../../data-fetch-service';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonAccordionGroup,
  IonAccordion,
  IonButton,
  IonProgressBar,
  AlertController,
  IonReorderGroup,
  IonReorder,
} from '@ionic/angular/standalone';

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
    IonItem,
    IonLabel,
    IonAccordionGroup,
    IonAccordion,
    IonButton,
    IonProgressBar,
    IonReorderGroup,
    IonReorder,
    AsyncPipe,
  ],
})
export class Page2Page implements OnInit {
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  public xpService = inject(XpService);
  private dataFetchService = inject(DataFetchService);
  public usersTrainingPrograms: TrainingProgram[] = [];
  public userData!: UserData;
  public isAccordionOpen = false;

  constructor() {
    // Alustetaan ikonit käyttöliittymää varten
    addIcons({ add, trashOutline, play, reorderTwoOutline });
  }

  ngOnInit() {}

  /**
   * Käsittelee liikkeiden uudelleenjärjestelyn treeniohjelman sisällä.
   * @param ev Ionicin reorder-tapahtuma
   * @param program Ohjelma, jonka liikkeitä järjestellään
   */
  handleReorder(
    ev: CustomEvent<ItemReorderEventDetail>,
    program: TrainingProgram,
  ) {
    // Annetaan Ionicin reorder-tapahtuman viitellä ja palauttaa järjestetty taulukko itsellään,
    // mikä estää Angularin ja Ionicin ristiriidat DOM:n päivittämisessä (ja ns. tuplaliikkeet).
    program.exercises = ev.detail.complete(program.exercises);
  }

  /**
   * Ohjaa käyttäjän treenisivulle ja välittää valitun ohjelman tiedot
   */
  startProgram(program: TrainingProgram) {
    // 3. TÄRKEÄÄ: Lähetetään syväkopio (JSON-kikka on varmin tapa poistaa vanhat viittaukset)
    const programToLaunch = JSON.parse(JSON.stringify(program));

    this.router.navigate(['/page5'], {
      state: { activeWorkout: programToLaunch },
    });
  }

  /**
   * Haetaan käyttäjän tiedot backendistä aina kun sivu tulee näkyviin
   */
  ionViewWillEnter() {
    this.dataFetchService.getUserDataById().subscribe({
      next: (data) => {
        this.userData = data as UserData;
        console.log('Test data loaded:', this.userData);
        this.loadPrograms();
      },
      error: (err) => {
        console.error('Failed to load test data', err);
      },
    });
  }

  /**
   * Apufunktio ohjelmien lataamiseen testidatasta
   */
  loadPrograms() {
    const data = this.userData?.trainingPrograms;
    if (data) {
      this.usersTrainingPrograms = data;
    }
  }

  /**
   * Poistaa treeniohjelman modal-ikkunan varmistuksen jälkeen
   */
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
            this.dataFetchService.deleteProgram(programId).subscribe({
              next: (data) => {
                console.log('Trainingprogram deleted successfully:', data);
                // Päivitetään data poiston jälkeen
                this.ionViewWillEnter();
              },
              error: (err) => {
                console.error('Failed to delete trainingprogram', err);
              },
            });
          },
        },
      ],
    });
    await alert.present();
  }

  /**
   * Seuraa haitarivalikon tilaa FAB-napin piilottamista varten
   */
  onAccordionChange(event: AccordionGroupCustomEvent) {
    this.isAccordionOpen = !!event.detail.value;
  }

  /**
   * Ohjaa uuden ohjelman luontisivulle
   */
  lisaaOhjelma() {
    this.router.navigate(['/page4']);
  }
}
