import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, AlertController } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonToolbar,
  IonTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowForward,
  arrowBack,
  checkmarkDone,
  timerOutline,
  trashOutline,
} from 'ionicons/icons';
import {
  TrainingProgram,
  TrainingSession,
  Exercise,
} from '../../types/userdata';
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
  // private http = inject(HttpClient);
  private menu = inject(MenuController);
  private alertController = inject(AlertController);
  private navCtrl = inject(NavController);
  @ViewChild('workoutTimer') timer!: TimerComponent;
  // --- TREENIN TILA ---
  public activeWorkoutReordered?: TrainingProgram;
  public currentIndex = 0;
  public workoutTimerDuration = 120;
  // finish confirmation state: user must click twice within short time to confirm finish
  public finishConfirm = false;
  private finishConfirmTimeoutId: number | undefined;
  // Käyttäjän syöttämät suoritetut arvot per liike
  public performedInputs: { sets?: PerformedSet[] }[] = [];
  // Näytettävät merkkijonoarvot per-set (jos tarvitsee näyttää esim. '20 kg')

  // Seuraa, mitkä per-set-kentät ovat fokuksessa, jotta placeholder voidaan piilottaa
  private focusedMap: Record<string, boolean> = {};
  // Hallitsee, onko kyseisen liikkeen settilista avattuna
  public expandedSets: boolean[] = [];
  private dataFetchService = inject(DataFetchService);

  public timerVisible = true;
  public nextBtnVisible = true;

  constructor() {
    addIcons({
      arrowForward,
      arrowBack,
      checkmarkDone,
      timerOutline,
      trashOutline,
    });

    // Luetaan navigoinnin mukana tullut treenidata
    const navigation = this.router.currentNavigation();
    this.activeWorkoutReordered =
      navigation?.extras.state?.['activeWorkoutReordered'];
  }

  /**
   * Poistaa viimeisen setin annetusta liikkeestä (käyttäjän pyynnöstä).
   * Päivittää myös `performedInputs`-rakenteen vastaavasti.
   */
  async removeLastSet(exerciseIndex: number) {
    const ex = this.activeWorkoutReordered?.exercises?.[exerciseIndex];
    if (!ex || !ex.sets) return;

    // Estetään kaikkien settien poistaminen: vähintään yksi pitää jäädä
    if (ex.sets.length <= 1) {
      const alert = await this.alertController.create({
        header: 'Ei sallittu',
        message:
          'Liikkeellä täytyy olla vähintään yksi setti. Et voi poistaa viimeistä settiä.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Varmistetaan käyttäjältä ennen lopullista poistoa
    const confirm = await this.alertController.create({
      header: 'Poistetaanko setti?',
      message: 'Haluatko varmasti poistaa tämän setin?',
      cssClass: 'delete-set-alert',
      buttons: [
        {
          text: 'Peruuta',
          role: 'cancel',
        },
        {
          text: 'Poista',
          role: 'destructive',
          handler: () => {
            // Poistetaan viimeinen set
            ex.sets.splice(ex.sets.length - 1, 1);

            // Poistetaan vastaava performedInputs-rivi, jos sellainen on
            if (!this.performedInputs) this.performedInputs = [];
            if (!this.performedInputs[exerciseIndex])
              this.performedInputs[exerciseIndex] = { sets: [] };
            if (
              this.performedInputs[exerciseIndex].sets &&
              this.performedInputs[exerciseIndex].sets.length > 0
            ) {
              this.performedInputs[exerciseIndex].sets.splice(
                this.performedInputs[exerciseIndex].sets.length - 1,
                1,
              );
            }

            // Triggeröidään change-detection varmistavasti uudella taulukolla
            if (
              this.activeWorkoutReordered &&
              this.activeWorkoutReordered.exercises
            ) {
              this.activeWorkoutReordered.exercises = [
                ...this.activeWorkoutReordered.exercises,
              ];
            }
          },
        },
      ],
    });

    await confirm.present();
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
    // Alusta tyhjät performedInputs niin, että oletusarvot näytetään placeholderina
    // mutta käyttäjän syötöt tallentuvat performedInputs:iin ja pysyvät näkyvissä.
    this.performedInputs = (this.activeWorkoutReordered?.exercises || []).map(
      (ex) => ({
        sets: (ex.sets || []).map(() => ({}) as PerformedSet),
      }),
    );

    // Alusta dropdown-tilat (oletuksena suljettu)
    this.expandedSets = (this.activeWorkoutReordered?.exercises || []).map(
      () => false,
    );
  }

  private resetFinishConfirm() {
    if (this.finishConfirmTimeoutId !== undefined) {
      clearTimeout(this.finishConfirmTimeoutId);
      this.finishConfirmTimeoutId = undefined;
    }
    this.finishConfirm = false;
  }

  toggleSets(index: number) {
    if (!this.expandedSets) this.expandedSets = [];
    this.expandedSets[index] = !this.expandedSets[index];
    // moving around resets any pending finish confirmation
    this.resetFinishConfirm();
  }

  /**
   * Safe accessor for expanded state to avoid "possibly undefined" when indexing the array.
   */
  getExpanded(index: number): boolean {
    return !!(this.expandedSets && this.expandedSets[index]);
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
    let strVal = rawVal === null || rawVal === undefined ? '' : String(rawVal);

    // Remove ' kg' if present before processing
    if (field === 'weight') {
      strVal = strVal.replace(/ kg/g, '').trim();
    }

    const truncated = strVal.length > 6 ? strVal.slice(0, 6) : strVal;

    // Päivitä näkyvä kenttä
    const target = event.target as unknown as { value?: string } | null;
    if (target && typeof target.value === 'string') target.value = truncated;

    if (!this.performedInputs[index])
      this.performedInputs[index] = { sets: [] };
    if (!this.performedInputs[index].sets)
      this.performedInputs[index].sets = [];
    if (!this.performedInputs[index].sets![setIndex])
      this.performedInputs[index].sets![setIndex] = {};

    if (truncated === '') {
      this.performedInputs[index].sets![setIndex][field] = undefined;
      return;
    }

    const asNumber = Number(truncated);
    this.performedInputs[index].sets![setIndex][field] = Number.isNaN(asNumber)
      ? undefined
      : asNumber;
  }

  /**
   * Safe getter used by the template to avoid possible 'undefined' access.
   * Returns a string (for binding to [value]) or empty string when not present.
   */
  getPerformedValue(
    index: number,
    setIndex: number,
    field: 'reps' | 'weight',
  ): string | number {
    if (!this.performedInputs) return '';
    const entry = this.performedInputs[index];
    if (!entry || !entry.sets) return '';
    const set = entry.sets[setIndex];
    if (!set) return '';
    const val = set[field];

    if (val === undefined || val === null) return '';

    // Append ' kg' when not focused
    if (field === 'weight') {
      const key = `${index}-${setIndex}-${field}`;
      if (!this.focusedMap[key]) {
        return `${val} kg`;
      }
    }

    return val;
  }

  // Palauttaa placeholder-tekstin tai tyhjän merkkijonon, jos kyseinen kenttä on fokuksessa
  getPlaceholder(
    index: number,
    setIndex: number,
    field: 'reps' | 'weight',
    exercise?: Exercise,
  ): string {
    const key = `${index}-${setIndex}-${field}`;
    if (this.focusedMap[key]) return '';

    // Jos käyttäjä on syöttänyt arvon, älä näytä fallback-placeholderia
    const performed = this.getPerformedValue(index, setIndex, field);
    if (performed !== '') return '';

    // Muodosta oletusteksti harjoitustiedosta
    if (field === 'reps') {
      return (exercise?.sets?.[setIndex]?.reps ?? 'toistot') as string;
    }
    // weight
    const w = exercise?.sets?.[setIndex]?.weight;
    return w ? `${w} kg` : 'kg';
  }

  onInputFocus(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: any,
    index: number,
    setIndex: number,
    field: 'reps' | 'weight',
  ) {
    const key = `${index}-${setIndex}-${field}`;
    this.focusedMap[key] = true;
    this.nextBtnVisible = false;
    this.timerVisible = false;

    // Wait a brief moment for the keyboard to slide up, then scroll to center
    setTimeout(() => {
      const target = event.target as HTMLElement;
      if (target && target.scrollIntoView) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  }

  onInputBlur(index: number, setIndex: number, field: 'reps' | 'weight') {
    const key = `${index}-${setIndex}-${field}`;
    delete this.focusedMap[key];

    // Viive varmistaa, että jos käyttäjä siirtyy suoraan toiseen kenttään,
    // uusi focus-tapahtuma ehtii asettaa uuden avaimen focusedMap-objektiin
    // ennen kuin tarkistamme, onko mikään kenttä enää fokuksessa.
    setTimeout(() => {
      if (Object.keys(this.focusedMap).length === 0) {
        this.nextBtnVisible = true;
        this.timerVisible = true;
      }
    }, 50);
  }

  ionViewWillEnter() {
    this.menu.enable(false); //menu disabled
  }

  ionViewWillLeave() {
    this.menu.enable(true); //varmistaa että menu tulee takaisin seuraavalla sivulla
    this.resetFinishConfirm();
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
  get currentExercise(): Exercise | undefined {
    return this.activeWorkoutReordered?.exercises?.[this.currentIndex];
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
   * Siirtyy edelliseen liikkeeseen.
   */
  edellinenLiike() {
    // pysäytetään ja nollataan kello
    if (this.timer) {
      this.timer.forceStopAndReset();
    }

    if (this.currentIndex > 0) {
      // Tallenna mahdolliset syötöt nykyisestä liikkeestä
      this.applyPerformedToExercise(this.currentIndex);
      this.currentIndex--;
      this.resetFinishConfirm();
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
      exercises: this.activeWorkoutReordered?.exercises || [],
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
    this.navCtrl.navigateRoot('/page6', {
      animated: true,
      state: { finishedSession: finishedSession },
    });
  }

  /**
   * Wrapper for Finish button: requires two clicks within a short time window.
   */
  confirmFinish() {
    if (this.finishConfirm) {
      // second click: proceed
      this.resetFinishConfirm();
      this.lopetaTreeni();
      return;
    }

    // first click: set flag and timeout to reset
    this.finishConfirm = true;
    this.finishConfirmTimeoutId = window.setTimeout(() => {
      this.finishConfirm = false;
      this.finishConfirmTimeoutId = undefined;
    }, 3000);
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
