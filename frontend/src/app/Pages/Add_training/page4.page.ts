/**
 * Lisää treeni -näkymä
 */

import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { MenuController } from '@ionic/angular/standalone'; // tuodaan MenuController jotta voimme poistaa valikon käytöstä
import { addOutline, trashOutline } from 'ionicons/icons';
import { DataFetchService } from '../../data-fetch-service';
import {
  Exercise,
  ExerciseIsSelected,
  Move,
  Category2,
} from '../../types/userdata';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonTextarea,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonAccordionGroup,
  IonAccordion,
  IonCheckbox,
  IonIcon,
  IonModal,
  IonSegment,
  IonSegmentButton,
  AlertController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-page4',
  templateUrl: './page4.page.html',
  styleUrls: ['./page4.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonAccordionGroup,
    IonAccordion,
    IonCheckbox,
    IonIcon,
    IonModal,
    IonSegment,
    IonSegmentButton,
    CommonModule,
    FormsModule,
    IonTextarea,
  ],
})
export class LisaaTreeni {
  // Haetaan viittaus HTML-puolen 'ion-accordion-group' -elementtiin,
  // jotta sitä voidaan ohjata suoraan koodista (esim. avaaminen/sulkeminen).
  @ViewChild('myAccordionGroup', { static: false })
  private accordionGroup!: IonAccordionGroup;
  // Muuttuja, johon tallennetaan käyttäjän antama treeniohjelman nimi.
  public programName: string = '';
  public programDescription: string = '';
  // public programTimerAmount: number = 120;
  public isCustomMoveModalOpen: boolean = false;
  public newMoveName: string = '';
  public newMoveMuscle: string = '';
  public isExerciseModalOpen: boolean = false;
  public modalExercise: ExerciseIsSelected | null = null;
  public modalTempSets: { reps: number; weight: number }[] = [];
  public modalSingleReps: string = '';
  public modalSingleWeight: string = '';
  public modalInputCount: string = '';
  private menu = inject(MenuController);
  public newMoveType: 'compound' | 'targeted' = 'compound';
  public exerciseList2: Category2[] = [];
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private dataFetchService = inject(DataFetchService);
  // backendistä haetut movet laitetaan tänne taulukkoon josta ne voidaan näyttää käyttöliittmässä
  private usersMoves!: Move[];
  private editProgramId: string | null = null;
  public isEditMode = false;
  public pageTitle: string = 'Luo uusi treeniohjelma';

  constructor() {
    addIcons({ addOutline, trashOutline });
  }
  preSelectExercises(existingExercises: Exercise[]) {
    existingExercises.forEach((ex) => {
      this.exerciseList2.forEach((cat) => {
        cat.exercises.forEach((e) => {
          if (e.move._id === ex.move._id) {
            e.isSelected = true;
            e.sets = ex.sets.map((s) => ({ ...s }));
          }
        });
      });
    });
    // Pakotetaan Ionicin change detection huomaamaan muutokset päivittämällä
    // taulukon viite — muuten UI ei välttämättä päivity automaattisesti
    this.exerciseList2 = [...this.exerciseList2];
  }
  /**
   * Kun page4-sivu on tulossa näkyviin haetaan kaikki käyttäjän movet databasesta
   * Ne näytetään kategorioittain tässä näkymässä koska ollaan luomassa uusi treeniohjelma mihin valitaan liikkeitä
   */
  ionViewWillEnter() {
    // Kun sivu tulee näkyviin: estä sivuvalikko ja hae kaikki liikkeet backendistä.
    // Tämän kutsun jälkeen `categorizeMoves()` rakentaa käyttöliittymään
    // tarvittavan `exerciseList2`-rakenteen.
    this.menu.enable(false);

    const nav = this.router.currentNavigation() ?? history.state;
    // Korvattu (nav as any) tarkemmalla inline-tyypityksellä
    const state =
      (nav as { extras?: { state?: unknown } })?.extras?.state ?? nav;
    const existing = state?.editProgram;

    if (existing) {
      this.isEditMode = true;
      this.pageTitle = 'Muokkaa treeniohjelmaa';
      this.editProgramId = existing._id;
      this.programName = existing.name;
      this.programDescription = existing.description;
    } else {
      this.isEditMode = false;
      this.editProgramId = null;
    }

    this.dataFetchService.getAllMoves().subscribe({
      next: (data) => {
        this.usersMoves = data as Move[];
        this.categorizeMoves();
        // Edit-moodissa: esivalitse ohjelman liikkeet
        if (existing) this.preSelectExercises(existing.exercises);
      },
      error: (err) => console.error('Failed to fetch moves', err),
    });
  }
  ionViewWillLeave() {
    this.menu.enable(true); //varmistaa että menu tulee takaisin seuraavalla sivulla
  }
  /**
   * Käsittelee backendistä haetut liikkeet ja ryhmittelee ne `muscleGroup`-ominaisuuden mukaan
   */
  categorizeMoves() {
    // Ryhmitä backendistä haetut liikkeet lihasryhmän mukaan.
    // Luo myös erillinen kategoria "Omat liikkeet" käyttäjän custom-liikkeille.
    this.exerciseList2 = []; // Tyhjennä aiemmat kategoriat ennen uudelleenrakennusta

    this.usersMoves.forEach((x) => {
      const exerciseToAdd: ExerciseIsSelected = {
        move: x,
        sets: [
          { reps: 8, weight: 0 },
          { reps: 8, weight: 0 },
          { reps: 8, weight: 0 },
        ],
        isSelected: false,
      };

      // 1. Lisää alkuperäiseen lihasryhmään
      let originalCategory = this.exerciseList2.find(
        (y) => y.category === x.muscleGroup,
      );

      if (!originalCategory) {
        originalCategory = {
          category: x.muscleGroup,
          exercises: [],
        };
        this.exerciseList2.push(originalCategory);
      }

      // Tarvitaan syväkopio seteistä, jotta kahden eri viitteen muokkaukset eivät vaikuta toisiinsa
      const exerciseForOriginal = {
        ...exerciseToAdd,
        sets: exerciseToAdd.sets.map((set) => ({ ...set })),
      };
      originalCategory.exercises.push(exerciseForOriginal);

      // 2. Jos liike on käyttäjän oma (ei oletus), lisää se myös "Omat liikkeet"-kategoriaan
      if (!x.isDefault) {
        let customCat = this.exerciseList2.find(
          (y) => y.category === 'Omat liikkeet',
        );

        if (!customCat) {
          customCat = {
            category: 'Omat liikkeet',
            exercises: [],
          };
          this.exerciseList2.push(customCat);
        }

        const exerciseForCustom = {
          ...exerciseToAdd,
          sets: exerciseToAdd.sets.map((set) => ({ ...set })),
        };
        customCat.exercises.push(exerciseForCustom);
      }
    });

    // Siirrä 'Omat liikkeet' listan viimeiseksi kategoriaksi
    const customIndex = this.exerciseList2.findIndex(
      (c) => c.category === 'Omat liikkeet',
    );
    if (customIndex !== -1) {
      const [customCat] = this.exerciseList2.splice(customIndex, 1);
      this.exerciseList2.push(customCat);
    }

    // Päivitä taulukon viite, jotta Ionicin change detection huomaa kategoriamuutokset heti
    this.exerciseList2 = [...this.exerciseList2];
  }

  getSelectedCount(category: Category2): number {
    return category.exercises.filter((e) => e.isSelected).length;
  }

  /**
   * Apufunktio sarjojen määrän päivittämiseen
   * Kun käyttäjä muuttaa sarjojen määrää, lisätään tai poistetaan kohteita
   * `modalTempSets`-taulukosta jotta jokaiselle sarjalle on reps/weight-objekti.
   */
  updateSets(exercise: ExerciseIsSelected, newLengthVal: string) {
    if (!exercise.sets) {
      exercise.sets = [];
    }

    // Muunna syöte numeroksi ja validoi se. Tämän metodin tarkoitus on
    // varmistaa että `exercise.sets`-taulukossa on oikea määrä objekteja.
    // Lisätessä uusiin seteihin kopioidaan ensimmäisen setin arvot oletuksena.
    const newLength = parseInt(newLengthVal, 10);
    if (isNaN(newLength) || newLength < 0) {
      return;
    }

    const currentLength = exercise.sets.length;

    if (newLength > currentLength) {
      // Lisää uusia settejä oletusarvoilla, kopioiden arvot ensimmäisestä setistä
      for (let i = currentLength; i < newLength; i++) {
        exercise.sets.push({
          reps: exercise.sets[0].reps,
          weight: exercise.sets[0].weight,
        }); // Oletusarvot
      }
    } else if (newLength < currentLength) {
      // Poista ylimääräiset setit lopusta
      exercise.sets.splice(newLength);
    }
  }

  /**
   * Apumenetelmä kaikkien sarjojen toistomäärien päivittämiseen kerralla
   */
  updateAllReps(exercise: ExerciseIsSelected, newRepsVal: string) {
    // Aseta jokaisen sarjan `reps`-kenttä samaan arvoon.
    const newReps = parseInt(newRepsVal, 10);
    if (isNaN(newReps) || newReps < 0) return;

    if (exercise.sets) {
      exercise.sets.forEach((set) => {
        set.reps = newReps;
      });
    }
  }

  /**
   * Apumenetelmä kaikkien sarjojen painojen päivittämiseen kerralla
   */
  updateAllWeights(exercise: ExerciseIsSelected, newWeightsVal: string) {
    // Aseta jokaisen sarjan `weight`-kenttä samaan arvoon.
    const newWeight = this.parseWeightString(String(newWeightsVal));
    if (isNaN(newWeight) || newWeight < 0) return;

    if (exercise.sets) {
      exercise.sets.forEach((set) => {
        set.weight = newWeight;
      });
    }
  }

  /**
   * Parsii painokentän merkkijonon hyväksyen sekä pilkun että pisteen
   * desimaalierottimena. Poistaa ei-numeraaliset merkit, varmistaa korkeintaan
   * yhden desimaalipisteen ja rajoittaa desimaalit kahteen desimaaliin.
   */
  private parseWeightString(raw: string): number {
    if (!raw) return NaN;
    let s = String(raw).trim();
    // hyväksy pilkku ja piste — muut merkit pois
    s = s.replace(',', '.');
    s = s.replace(/[^0-9.]/g, '');
    if (s === '') return NaN;
    // Poista ylimääräiset pisteet (pidä ensimmäinen)
    const firstDot = s.indexOf('.');
    if (firstDot !== -1) {
      const before = s.slice(0, firstDot + 1);
      const after = s.slice(firstDot + 1).replace(/\./g, '');
      s = before + after;
      // rajoita desimaaleihin max 2
      const dotIdx = s.indexOf('.');
      if (dotIdx !== -1) {
        s = s.slice(0, dotIdx + 1 + Math.min(2, s.length - dotIdx - 1));
      }
    }
    const parsed = parseFloat(s);
    return Number.isNaN(parsed) ? NaN : parsed;
  }

  toggleSelection(item: ExerciseIsSelected) {
    // Vaihda liikkeen valintatila (valittu / ei valittu) kun käyttäjä klikkaa riviä.
    // Valinta vaikuttaa siihen, näytetäänkö modal-painike rivillä.
    item.isSelected = !item.isSelected;
  }

  /**
   * Poistaa yksittäisen harjoituksen.
   */
  async removeExercise(exerciseToRemove: ExerciseIsSelected, event: Event) {
    event.stopPropagation();
    // Näytä varmistusdialogi ennen liikkeen poistamista backendistä.
    // Jos käyttäjä vahvistaa, kutsutaan DataFetchService.deleteMove ja
    // päivitetään liikelista backendistä haettuihin arvoihin.
    const alert = await this.alertCtrl.create({
      header: 'Poistetaanko liike?',
      message: 'Haluatko varmasti poistaa tämän liikkeen?',
      buttons: [
        { text: 'Peruuta', role: 'cancel' },
        {
          text: 'Poista',
          role: 'destructive',
          handler: () => {
            this.dataFetchService
              .deleteMove(exerciseToRemove.move._id)
              .subscribe({
                next: (data) => {
                  console.log('Custom move deleted successfully:', data);

                  // Päivitä liikelista haun jälkeen:
                  this.dataFetchService.getAllMoves().subscribe({
                    next: (data) => {
                      this.usersMoves = data as Move[];
                      console.log(
                        'Moves fetched successfully:',
                        this.usersMoves,
                      );
                      this.categorizeMoves();
                    },
                    error: (err) => {
                      console.error('Failed to fetch moves', err);
                    },
                  });
                },
                error: (err) => {
                  console.error('Failed to delete custom move', err);
                },
              });
          },
        },
      ],
    });
    await alert.present();
  }

  /**
   * Nollaa kaikki valinnat ja syötetyt arvot.
   */
  resetSelections() {
    // Palauta sivun tilat oletuksiin: tyhjennä ohjelman nimi, sulje accordion
    // ja nollaa jokaisen liikkeen valinnat ja sarjat oletusarvoihin.
    this.programName = ''; // Tyhjennetään ohjelman nimi
    this.programDescription = ''; // Tyhjennetään ohjelman kuvaus

    if (this.accordionGroup) {
      this.accordionGroup.value = undefined; // Suljetaan kaikki accordionit
    }

    this.exerciseList2.forEach((category) => {
      category.exercises.forEach((exercise) => {
        exercise.isSelected = false; // Poistetaan valinta
        exercise.sets = [
          { reps: 8, weight: 0 },
          { reps: 8, weight: 0 },
          { reps: 8, weight: 0 },
        ]; // Palautetaan oletusarvot
      });
    });
  }

  openCustomMoveModal() {
    // Avaa pieni modal oman liikkeen luomiselle ja nollaa syötekentät.
    this.newMoveName = '';
    this.newMoveMuscle = '';
    this.newMoveType = 'compound';
    this.isCustomMoveModalOpen = true;
  }

  /**
   * Kun painetaan 'Peruuta' luodessa omaa liikettä modalissa
   */
  cancelCreateCustomMove() {
    // Peruuta custom-move -modal
    this.isCustomMoveModalOpen = false;
  }

  /**
   * Avaa modalin tietylle liikkeelle sarjojen/toistojen/painojen muokkaamista varten
   */
  openExerciseModal(exercise: ExerciseIsSelected) {
    // Avaa modal tietylle liikkeelle. Kopioi nykyiset sarjat `modalTempSets`-
    // taulukkoon, jotta käyttäjä voi muokata/arvot ilman että alkuperäinen
    // `exercise.sets` muuttuu ennen tallennusta. Tyhjennä myös syötekentät
    // niin että ne toimivat placeholdereina nykyisille arvoille.
    this.modalExercise = exercise;
    this.modalTempSets = (exercise.sets || []).map((s) => ({ ...s }));
    if (this.modalTempSets.length === 0) {
      this.modalTempSets = [{ reps: 8, weight: 0 }];
    }
    this.modalSingleReps = '';
    this.modalSingleWeight = '';
    this.modalInputCount = '';
    this.isExerciseModalOpen = true;
  }

  /**
   * Sulje modal. Jos peruutetaan, älä tallenna muutoksia. `true`-parametri käsitellään peruutuksena.
   */
  closeExerciseModal(cancel: boolean = false) {
    // Sulje modal. Jos `cancel` on tosi, tyhjennä väliaikaiset arvot ja
    // peruuta muokkaus. Jos taas modal suljetaan tallennuksen jälkeen,
    // älä ylikirjoita `modalExercise.sets` täällä (saveExerciseModal hoitaa sen).
    if (cancel) {
      this.modalTempSets = [];
      this.modalExercise = null;
      this.isExerciseModalOpen = false;
      return;
    }

    this.modalTempSets = [];
    this.modalExercise = null;
    this.isExerciseModalOpen = false;
  }

  updateModalSetsCount(newLengthVal: string) {
    // Kun käyttäjä muuttaa sarjojen määrää modalissa, säädä `modalTempSets`
    // -taulukon pituutta vastaavasti. Uudet sarjat peritään ensimmäisen
    // setin arvoista oletuksena.
    const newLength = parseInt(String(newLengthVal), 10);
    if (isNaN(newLength) || newLength < 0) return;

    const currentLength = this.modalTempSets.length;
    if (newLength > currentLength) {
      for (let i = currentLength; i < newLength; i++) {
        const template = this.modalTempSets[0];
        this.modalTempSets.push({
          reps: template.reps,
          weight: template.weight,
        });
      }
    } else if (newLength < currentLength) {
      this.modalTempSets.splice(newLength);
    }
    // Koska modalissa käytetään nyt yhtä syöteriviä (kaikille sarjoille),
    // ei tarvitse synkronoida per-set-kenttiä täällä.
  }

  saveExerciseModal() {
    // Tallenna modalin syötteet: luo uusi `sets`-taulukko valitulla määrällä
    // sarjoja ja käytä modalissa annettuja toistoja/painoja. Jos kenttä on
    // tyhjä tai ei-numeraalinen, käytetään olemassa olevaa arvoa oletuksena.
    console.log('saveExerciseModal called', {
      modalExercise: this.modalExercise?.move?.name,
      modalInputCount: this.modalInputCount,
      modalSingleReps: this.modalSingleReps,
      modalSingleWeight: this.modalSingleWeight,
      modalTempSets: this.modalTempSets,
    });

    if (!this.modalExercise) {
      console.warn(
        'saveExerciseModal: modalExercise is null — closing modal without saving',
      );
      this.isExerciseModalOpen = false;
      return;
    }

    // Parsitaan käyttäjän syöte turvallisesti (muuntaen ensin stringiksi).
    const parsedCount = parseInt(String(this.modalInputCount ?? '').trim(), 10);
    const targetCount =
      !isNaN(parsedCount) && parsedCount > 0
        ? parsedCount
        : this.modalTempSets.length;

    const parsedReps = parseInt(String(this.modalSingleReps ?? '').trim(), 10);
    const parsedWeight = this.parseWeightString(
      String(this.modalSingleWeight ?? '').trim(),
    );
    const baseReps = !isNaN(parsedReps)
      ? parsedReps
      : this.modalTempSets[0].reps;
    const baseWeight = !isNaN(parsedWeight)
      ? parsedWeight
      : this.modalTempSets[0].weight;

    const newSets = [] as { reps: number; weight: number }[];
    for (let i = 0; i < targetCount; i++) {
      newSets.push({ reps: baseReps, weight: baseWeight });
    }
    // Aseta uudet sarjat muokattavaan harjoitukseen ja pakota UI-päivitys
    this.modalExercise.sets = newSets;
    this.exerciseList2 = [...this.exerciseList2];

    // Sulje modal, `closeExerciseModal(false)` vain tyhjentää tilan.
    this.closeExerciseModal(false);
  }

  /**
   * Kun painetaan 'Ok' luodessa omaa liikettä modalissa
   */
  confirmCreateCustomMove() {
    // Luo uusi custom-liike backendissä; validointi pienennetyllä nimellä
    const trimmedName = this.newMoveName.trim();
    if (trimmedName.length > 0 && trimmedName.length <= 30) {
      const newMove = {
        name: this.newMoveName,
        type: this.newMoveType,
        muscleGroup: this.newMoveMuscle,
      };

      this.dataFetchService.createMove(newMove).subscribe({
        next: (data) => {
          console.log('New move created:', data);
          // Päivitä liikelista haun jälkeen:
          this.dataFetchService.getAllMoves().subscribe({
            next: (data) => {
              this.usersMoves = data as Move[];
              console.log('Moves fetched successfully:', this.usersMoves);
              this.categorizeMoves();
            },
            error: (err) => {
              console.error('Failed to fetch moves', err);
            },
          });
        },
        error: (err) => {
          console.error('Failed to create new move', err);
        },
      });

      this.isCustomMoveModalOpen = false;
    }
  }

  addNewExercise(newName: string, newType: string) {
    let customCat = this.exerciseList2.find(
      (c) => c.category === 'Omat liikkeet',
    );

    if (!customCat) {
      // Luodaan uusi kategoria
      const newCategory: Category2 = {
        category: 'Omat liikkeet',
        exercises: [],
      };

      // TÄRKEÄÄ: Päivitetään koko taulukko levitysoperaattorilla,
      // jotta Ionic huomaa uuden Accordion-elementin heti.
      this.exerciseList2 = [...this.exerciseList2, newCategory];

      // Pakotetaan valikko auki heti luonnin jälkeen
      setTimeout(() => {
        if (this.accordionGroup) {
          this.accordionGroup.value = 'Omat liikkeet';
        }
      }, 50); // Pieni viive riittää

      // Etsitään juuri luotu kategoria, jotta voimme lisätä liikkeen siihen
      customCat = newCategory;
    }

    // Lisätään liike
    customCat.exercises.push({
      isSelected: false,
      move: {
        _id: String(Date.now()), // Väliaikainen ID kunnes tallennetaan backendiin
        name: newName,
        type: newType,
        muscleGroup: 'Omat liikkeet',
        isDefault: false,
        createdBy: null,
      },
      sets: [
        { reps: 8, weight: 0 },
        { reps: 8, weight: 0 },
        { reps: 8, weight: 0 },
      ],
    });
  }

  /**
   * Uusi saveProgram-metodi, mukautettu toimimaan back-endin ja tietokannan kanssa
   */
  saveProgram2() {
    // 1. Kerätään kaikki valitut liikkeet yhteen listaan
    // Muutetaan ExerciseIsSelected objektit Exercise muotoon
    // Kerää valitut liikkeet ja muunna backendin odottamaan muotoon.
    const selectedExercises: Exercise[] = this.exerciseList2
      .reduce(
        (all: ExerciseIsSelected[], c: Category2) => all.concat(c.exercises),
        [],
      )
      .filter((e: ExerciseIsSelected) => e.isSelected)
      .map((e) => ({ move: e.move, sets: e.sets })); //

    console.log('selectedExercises:', selectedExercises[0]?.move);
    console.log('selectedExercises:', selectedExercises[0]?.sets.length);

    // 2. Tarkistetaan että nimi on annettu ja liikkeitä valittu
    if (this.programName.trim().length > 0 && selectedExercises.length > 0) {
      console.log('Tallennetaan:', this.programName, selectedExercises);

      // 3. Luodaan uusi treeniohjelma-olio
      const newProgram2 = {
        name: this.programName,
        description: this.programDescription,
        exercises: selectedExercises,
      };

      // kutsutaan dataFetchServicen metodia joka lähettää POST http-requestin backendiin
      if (this.isEditMode && this.editProgramId) {
        this.dataFetchService
          .updateProgram(this.editProgramId, {
            name: this.programName,
            description: this.programDescription,
            exercises: selectedExercises,
          })
          .subscribe({
            next: () => {
              this.resetSelections();
              this.router.navigate(['/page2']);
            },
            error: (err) => {
              console.error('Error updating program:', err);
              alert('Päivitys epäonnistui. Yritä uudelleen.');
            },
          });
      } else {
        this.dataFetchService.createProgram(newProgram2).subscribe({
          next: (savedProgram) => {
            console.log('Tallennettu!', savedProgram);
            this.resetSelections();
            this.router.navigate(['/page2']);
          },
          error: (err) => {
            console.error('Error saving program:', err);
            alert('Tallennus epäonnistui. Yritä uudelleen.');
          },
        });
      }
    } else {
      alert('Anna ohjelmalle nimi ja valitse vähintään yksi liike.');
    }
  }
}
