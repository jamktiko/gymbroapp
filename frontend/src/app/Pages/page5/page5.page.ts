import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MenuController, AlertController } from '@ionic/angular/standalone';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonMenuButton,
  IonToolbar,
  IonTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForward, checkmarkDone, timerOutline } from 'ionicons/icons';
import { TrainingProgram, TrainingSession } from '../../types/userdata';
import { TimerComponent } from '../../timer/timer.component';
import { DataFetchService } from '../../data-fetch-service';

@Component({
  selector: 'app-page5',
  templateUrl: './page5.page.html',
  styleUrls: ['./page5.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonFooter,
    IonTitle,
    IonIcon,
    TimerComponent, // Lisätty importteihin
  ],
})
export class Page5Page implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private menu = inject(MenuController);
  private alertController = inject(AlertController);
  @ViewChild('workoutTimer') timer!: TimerComponent;
  // --- TREENIN TILA ---
  public activeWorkoutReordered!: TrainingProgram;
  public currentIndex = 0;
  public workoutTimerDuration = 120;
  private dataFetchService = inject(DataFetchService);

  constructor() {
    addIcons({ arrowForward, checkmarkDone, timerOutline });

    // Luetaan navigoinnin mukana tullut treenidata
    const navigation = this.router.currentNavigation();
    this.activeWorkoutReordered =
      navigation?.extras.state?.['activeWorkoutReordered'];
  }

  ngOnInit() {
    // Aloitetaan aina alusta ja varmistetaan datan löytyminen
    this.currentIndex = 0;

    if (!this.activeWorkoutReordered) {
      this.router.navigate(['/page2']);
    }
  }
  ionViewWillEnter() {
    this.menu.enable(false); //menu disabled
  }
  ionViewWillLeave() {
    this.menu.enable(true); //varmistaa että menu tulee takaisin seuraavalla sivulla
  }
  async keskeytaTreeniVahvistus() {
    //keskeyttää treenin
    const alert = await this.alertController.create({
      header: 'Keskeytetäänkö treeni?',
      message: 'Haluatko varmasti poistua? Edistymistäsi ei tallenneta.',
      cssClass: 'treeni-alert',
      buttons: [
        {
          text: 'Jatka treeniä',
          role: 'cancel',
          handler: () => {
            console.log('Palataan treeniin');
          },
        },
        {
          text: 'Lopeta tallentamatta',
          role: 'destructive',
          handler: () => {
            this.poistuTreenista();
          },
        },
      ],
    });

    await alert.present();
  }

  private poistuTreenista() {
    // Pysäytetään kello
    if (this.timer) {
      this.timer.forceStopAndReset();
    }

    // Tyhjennetään indeksi
    this.currentIndex = 0;

    // takasin etusivulle
    this.router.navigate(['/page2'], { replaceUrl: true });
  }
  /**
   * Palauttaa  liikkeen datan.
   */
  get currentExercise() {
    return this.activeWorkoutReordered?.exercises[this.currentIndex];
  }

  // --- TREENILOGIIKKA ---

  /**
   * Siirtyy seuraavaan liikkeeseen.
   * Timer nollautuu automaattisesti komponentin sisällä, kun se saa uuden inputin.
   */
  seuraavaLiike() {
    // 1. PYSÄYTETÄÄN JA NOLLATAAN KELLO
    if (this.timer) {
      this.timer.forceStopAndReset();
    }

    // 2. SIIRRYTÄÄN SEURAAVAAN LIIKKEESEEN
    if (
      this.currentIndex <
      (this.activeWorkoutReordered?.exercises?.length || 0) - 1
    ) {
      this.currentIndex++;
    }
  }
  /**
   * Päättää treenin ja siirtyy XP-sivulle.
   */
  lopetaTreeni() {
    const finishedSession: Omit<
      TrainingSession,
      '_id' | 'createdAt' | 'updatedAt' | 'datetime'
    > = {
      exercises: this.activeWorkoutReordered.exercises,
      breakTimeSeconds: this.workoutTimerDuration,
    };

    // Pysäytetään kello myös tässä
    if (this.timer) {
      this.timer.forceStopAndReset();
    }

    this.currentIndex = 0;

    // navigoi xp-näkymään:
    this.router.navigate(['/page6'], {
      replaceUrl: true,
      state: { finishedSession: finishedSession },
    });
  }
}

/**
 * Ohjaa käyttäjän treenisivulle ja välittää valitun ohjelman tiedot
 */
// startProgram(finishedTrainingProgram: TrainingProgram) {
//   // 3. TÄRKEÄÄ: Lähetetään syväkopio (JSON-kikka on varmin tapa poistaa vanhat viittaukset)
//   const programToLaunch = JSON.parse(JSON.stringify(this.activeWorkoutReordered));

//   this.router.navigate(['/page5'], {
//     state: { activeWorkoutReordered: programToLaunch },
//   })
// }
