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
  IonInput,
  IonToolbar,
  IonTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForward, checkmarkDone, timerOutline } from 'ionicons/icons';
import { TrainingProgram, TrainingSession } from '../../types/userdata';
import { TimerComponent } from '../../timer/timer.component';
import { DataFetchService } from '../../data-fetch-service';

// Setin tyyppi suorituksille
type PerformedSet = { reps?: number; weight?: number };

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
      IonInput,
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
  // Käyttäjän syöttämät suoritetut arvot per liike
  public performedInputs: { sets?: PerformedSet[] }[] = [];
  // Hallitsee, onko kyseisen liikkeen settilista avattuna
  public expandedSets: boolean[] = [];
  private dataFetchService = inject(DataFetchService);

  constructor() {
    addIcons({ arrowForward, checkmarkDone, timerOutline });

    // Luetaan navigoinnin mukana tullut treenidata
    const navigation = this.router.currentNavigation();
    this.activeWorkoutReordered =
      navigation?.extras.state?.['activeWorkoutReordered'];
  }

  /**
   * Kopioi käyttäjän syöttämät suoritetut arvot valitun liikkeen seteihin
   */
  private applyPerformedToExercise(index: number) {
    const exercise = this.activeWorkoutReordered?.exercises[index];
    if (!exercise) return;

    const performedEntry = this.performedInputs[index];
    const performedSets = performedEntry?.sets;

    // Kopioi per-set-arvot käyttäjän syötteestä exercise.sets:iin
    if (performedSets && performedSets.length > 0) {
      // Käy läpi niin monta settiä kuin käyttäjä on syöttänyt tai kuin exercise.sets sisältää
      const count = Math.min(performedSets.length, exercise.sets.length);
      for (let i = 0; i < count; i++) {
        const p = performedSets[i];
        if (!p) continue;
        if (p.reps !== undefined && p.reps !== null) {
          exercise.sets[i].reps = Number(p.reps);
        }
        if (p.weight !== undefined && p.weight !== null) {
          exercise.sets[i].weight = Number(p.weight);
        }
      }
    }
  }

  ngOnInit() {
    // Aloitetaan aina alusta ja varmistetaan datan löytyminen
    this.currentIndex = 0;

    if (!this.activeWorkoutReordered) {
      this.router.navigate(['/page2']);
    }
    // Alusta taulukko suoritetuille arvoille yhtä pitkäksi kuin harjoitus
    this.performedInputs = (this.activeWorkoutReordered?.exercises || []).map((ex) => ({
      sets: (ex.sets || []).map(() => ({} as PerformedSet)),
    }));

    // Alusta dropdown-tilat (oletuksena suljettu)
    this.expandedSets = (this.activeWorkoutReordered?.exercises || []).map(() => false);
  }

  toggleSets(index: number) {
    if (!this.expandedSets) this.expandedSets = [];
    this.expandedSets[index] = !this.expandedSets[index];
  }

  // Poistettu globaalin `limitInput`-funktion käyttö; käytetään per-set-funktiota `limitPerSetInput`.

  /**
   * Rajaa per-set syötteen pituuden enintään 6 merkkiin ja päivittää `performedInputs[index].sets[i]`.
   */
  limitPerSetInput(
    event: Event & { detail?: { value?: string | number | null } },
    index: number,
    setIndex: number,
    field: 'reps' | 'weight',
  ) {
    const rawVal = event?.detail?.value;
    const strVal = rawVal === null || rawVal === undefined ? '' : String(rawVal);
    const truncated = strVal.length > 6 ? strVal.slice(0, 6) : strVal;

    // Päivitä näkyvä kenttä
    const target = event.target as unknown as { value?: string } | null;
    if (target && typeof target.value === 'string') target.value = truncated;

    if (!this.performedInputs[index]) this.performedInputs[index] = { sets: [] };
    if (!this.performedInputs[index].sets) this.performedInputs[index].sets = [];
    if (!this.performedInputs[index].sets![setIndex]) this.performedInputs[index].sets![setIndex] = {};

    if (truncated === '') {
      this.performedInputs[index].sets![setIndex][field] = undefined;
      return;
    }

    const asNumber = Number(truncated);
    this.performedInputs[index].sets![setIndex][field] = Number.isNaN(asNumber) ? undefined : asNumber;
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
      // Tallenna käyttäjän syöttämät suoritetut arvot nykyiseen liikkeeseen
      this.applyPerformedToExercise(this.currentIndex);
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

    // Tallenna myös nykyisen liikkeen suoritetut arvot ennen lopetusta
    this.applyPerformedToExercise(this.currentIndex);

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
