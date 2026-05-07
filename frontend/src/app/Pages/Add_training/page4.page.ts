/**
 * Add_training näkymä
 */

import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
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
  ],
})
export class LisaaTreeni {
  // Haetaan viittaus HTML-puolen 'ion-accordion-group' -elementtiin,
  // jotta sitä voidaan ohjata suoraan koodista (esim. avaaminen/sulkeminen).
  @ViewChild('myAccordionGroup', { static: false })
  private accordionGroup!: IonAccordionGroup;
  // Muuttuja, johon tallennetaan käyttäjän antama treeniohjelman nimi.
  public programName: string = '';
  public isCustomMoveModalOpen: boolean = false;
  public newMoveName: string = '';
  public newMoveMuscle: string = '';
  public newMoveType: 'compound' | 'targeted' = 'compound';
  public exerciseList2: Category2[] = [];
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private dataFetchService = inject(DataFetchService);
  // backendistä haetut movet laitetaan tänne taulukkoon josta ne voidaan näyttää käyttöliittmässä
  private usersMoves!: Move[];

  constructor() {
    addIcons({ addOutline, trashOutline });
  }

  /**
   * Kun page4-sivu on tulossa näkyviin haetaan kaikki käyttäjän movet databasesta
   * Ne näytetään kategorioittain tässä näkymässä koska ollaan luomassa uusi treeniohjelma mihin valitaan liikkeitä
   */
  ionViewWillEnter() {
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
  }

  /**
   * Takes moves fetched from database and categorizes them by muscleGroup property
   */
  categorizeMoves() {
    this.exerciseList2 = []; // Clear previous categories before re-categorizing

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

      // 1. Add to its original muscleGroup
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

      // Need a deep copy of the sets so the two references do not modify each other if added to both
      const exerciseForOriginal = {
        ...exerciseToAdd,
        sets: exerciseToAdd.sets.map((set) => ({ ...set })),
      };
      originalCategory.exercises.push(exerciseForOriginal);

      // 2. If it's a custom move (not default), also add to "Omat liikkeet"
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

    // Move 'Omat liikkeet' to be the very last category in the list
    const customIndex = this.exerciseList2.findIndex(
      (c) => c.category === 'Omat liikkeet',
    );
    if (customIndex !== -1) {
      const [customCat] = this.exerciseList2.splice(customIndex, 1);
      this.exerciseList2.push(customCat);
    }

    // Update the array reference so Ionic change detection picks up new categories immediately
    this.exerciseList2 = [...this.exerciseList2];
  }

  /**
   * Helper method to update the amount of Sets
   * this is because whenever a user changes the amount of sets for a move, we need to add also a new object with reps and weights otherwise it will be undefined
   */
  updateSets(exercise: ExerciseIsSelected, newLengthVal: string) {
    if (!exercise.sets) {
      exercise.sets = [];
    }

    const newLength = parseInt(newLengthVal, 10);
    if (isNaN(newLength) || newLength < 0) {
      return;
    }

    const currentLength = exercise.sets.length;

    if (newLength > currentLength) {
      // Add new sets with default values, copying from the first set
      for (let i = currentLength; i < newLength; i++) {
        exercise.sets.push({
          reps: exercise.sets[0].reps,
          weight: exercise.sets[0].weight,
        }); // Default values
      }
    } else if (newLength < currentLength) {
      // Remove extra sets from the end
      exercise.sets.splice(newLength);
    }
  }

  /**
   * Helper method for updating all sets reps at once
   */
  updateAllReps(exercise: ExerciseIsSelected, newRepsVal: string) {
    const newReps = parseInt(newRepsVal, 10);
    if (isNaN(newReps) || newReps < 0) return;

    if (exercise.sets) {
      exercise.sets.forEach((set) => {
        set.reps = newReps;
      });
    }
  }

  /**
   * Helper method for updating all sets weights at once
   */
  updateAllWeights(exercise: ExerciseIsSelected, newWeightsVal: string) {
    const newWeight = parseInt(newWeightsVal, 10);
    if (isNaN(newWeight) || newWeight < 0) return;

    if (exercise.sets) {
      exercise.sets.forEach((set) => {
        set.weight = newWeight;
      });
    }
  }

  toggleSelection(item: ExerciseIsSelected) {
    item.isSelected = !item.isSelected;
  }

  /**
   * Poistaa yksittäisen harjoituksen.
   */
  async removeExercise(exerciseToRemove: ExerciseIsSelected, event: Event) {
    event.stopPropagation();
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

                  // update all new moves afterwards:
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
    this.programName = ''; // Tyhjennetään ohjelman nimi

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
    this.newMoveName = '';
    this.newMoveMuscle = '';
    this.newMoveType = 'compound';
    this.isCustomMoveModalOpen = true;
  }

  /**
   * When pressing 'cancel' when inside create custom move modal
   */
  cancelCreateCustomMove() {
    this.isCustomMoveModalOpen = false;
  }

  /**
   * When pressing 'ok' when inside create custom move modal
   */
  confirmCreateCustomMove() {
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
          // update all new moves afterwards:
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
   * New saveProgram method modified to work with backend and database
   */
  saveProgram2() {
    // 1. Kerätään kaikki valitut liikkeet yhteen listaan
    // Muutetaan ExerciseIsSelected objektit Exercise muotoon
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
        description: '',
        exercises: selectedExercises,
      };

      // kutsutaan dataFetchServicen metodia joka lähettää POST http-requestin backendiin
      this.dataFetchService.createProgram(newProgram2).subscribe({
        next: (savedProgram) => {
          console.log(
            'Treeni tallennettu onnistuneesti backendille!',
            savedProgram,
          );

          this.resetSelections();
          this.router.navigate(['/page2']);
        },
        error: (err) => {
          console.error('Error saving program:', err);
          alert('Treeniohjelman tallennus epäonnistui. Yritä uudelleen.');
        },
      });
    } else {
      alert('Täytä nimi ja valitse vähintään yksi liike.');
    }
  }
}
