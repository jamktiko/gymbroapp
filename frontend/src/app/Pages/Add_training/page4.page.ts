import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';
import { DataFetchService } from '../../data-fetch-service';
import { ExerciseIsSelected, Move } from '../../types/userdata';

interface Category2 {
  category: string;
  exercises: ExerciseIsSelected[];
}

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
    CommonModule,
    FormsModule,
  ],
})
export class LisaaTreeni {
  // Haetaan viittaus HTML-puolen 'ion-accordion-group' -elementtiin,
  // jotta sitä voidaan ohjata suoraan koodista (esim. avaaminen/sulkeminen).
  @ViewChild('myAccordionGroup', { static: false })
  accordionGroup!: IonAccordionGroup;
  // Muuttuja, johon tallennetaan käyttäjän antama treeniohjelman nimi.
  programName: string = '';

  exerciseList2: Category2[] = [];

  private router = inject(Router);
  private alertCtrl = inject(AlertController);

  private dataFetchService = inject(DataFetchService);

  // backendistä haetut movet laitetaan tänne taulukkoon josta ne voidaan näyttää käyttöliittmässä
  private testData!: Move[];

  // Konstruktorissa alustetaan Ionic-ikonit käyttöä varten.
  constructor() {
    addIcons({ addOutline, trashOutline });
  }

  // Kun page4-sivu on tulossa näkyviin haetaan kaikki käyttäjän movet databasesta
  // Ne näytetään kategorioittain tässä näkymässä koska ollaan luomassa uusi treeniohjelma mihin valitaan liikkeitä
  ionViewWillEnter() {
    this.dataFetchService.getAllMoves().subscribe({
      next: (data) => {
        this.testData = data as Move[];
        console.log('Test data loaded:', this.testData);
        // this.loadPrograms();
        this.categorizeMoves();
      },
      error: (err) => {
        console.error('Failed to load test data', err);
      },
    });
  }

  // takes moves fetched from database and categorizes them by muscleGroup property:
  categorizeMoves() {
    this.testData.forEach((x) => {
      const indexOfExistingCategory = this.exerciseList2.findIndex((y) => {
        return y.category === x.muscleGroup;
      });

      const exerciseToAdd: ExerciseIsSelected = {
        move: x,
        sets: [
          {
            reps: 8,
            weight: 0,
          },
          {
            reps: 8,
            weight: 0,
          },
          {
            reps: 8,
            weight: 0,
          },
        ],
        isSelected: false,
      };

      // if existing not found -> index is -1 -> we create a new Category2 object:
      if (indexOfExistingCategory === -1) {
        const categoryName = x.muscleGroup;
        const newCategory2Obj: Category2 = {
          category: categoryName,
          exercises: [exerciseToAdd],
        };
        this.exerciseList2.push(newCategory2Obj);
      } else {
        // else it got found already, just push it to the found index:
        this.exerciseList2[indexOfExistingCategory].exercises.push(
          exerciseToAdd,
        );
      }
    });
  }

  // helper method to update the amount of Sets
  // this is because whenever a user changes the amount of sets for a move, we need to add also a new object with reps and weights otherwise it will be undefined
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

  updateAllReps(exercise: ExerciseIsSelected, newRepsVal: string) {
    const newReps = parseInt(newRepsVal, 10);
    if (isNaN(newReps) || newReps < 0) return;

    if (exercise.sets) {
      exercise.sets.forEach((set) => {
        set.reps = newReps;
      });
    }
  }

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
   * Poistaa yksittäisen harjoituksen "Omat liikkeet" -kategoriasta.
   */
  removeExercise(exerciseToRemove: ExerciseIsSelected) {
    const customCat = this.exerciseList2.find(
      (c) => c.category === 'Omat liikkeet',
    );
    if (customCat) {
      customCat.exercises = customCat.exercises.filter(
        (e) => e !== exerciseToRemove,
      );

      // Jos viimeinenkin oma liike poistetaan, poistetaan koko kategoria listasta
      if (customCat.exercises.length === 0) {
        this.exerciseList2 = this.exerciseList2.filter(
          (c) => c.category !== 'Omat liikkeet',
        );
      }
    }
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

  async openCustomExercise() {
    const alert = await this.alertCtrl.create({
      header: 'Luo uusi liike',
      inputs: [
        {
          name: 'inputValue',
          type: 'text',
          placeholder: 'Liikkeen nimi',
          attributes: {
            maxlength: 30,
          },
        },
      ],
      buttons: [
        { text: 'Peruuta', role: 'cancel', cssClass: 'alert-button-cancel' },
        {
          text: 'Lisää',
          cssClass: 'alert-button-confirm',
          handler: (data) => {
            const trimmedName = data.inputValue.trim();
            if (trimmedName.length > 0 && trimmedName.length <= 30) {
              this.addNewExercise(trimmedName);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  addNewExercise(newName: string) {
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
        type: 'custom',
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

  // BACKEND-MUUTOS: Tuo HttpClient yläreunaan myöhemmin
  // import { HttpClient } from '@angular/common/http';

  saveProgram() {
    // 1. Kerätään kaikki valitut liikkeet yhteen listaan
    const selectedExercises = this.exerciseList2
      .reduce(
        (all: ExerciseIsSelected[], c: Category2) => all.concat(c.exercises),
        [],
      )
      .filter((e: ExerciseIsSelected) => e.isSelected)
      .map((e) => ({ move: e.move, sets: e.sets })); // Muutetaan ExerciseIsSelected muodosta Exercise muotoon

    // Tarkistetaan että nimi on annettu ja liikkeitä valittu
    if (this.programName.trim().length > 0 && selectedExercises.length > 0) {
      console.log('Tallennetaan:', this.programName, selectedExercises);

      // 2. Luodaan uusi treeniohjelma-olio
      const newProgram = {
        // BACKEND-MUUTOS: Backend yleensä luo ID:n puolestasi, joten Date.now() lähtee pois
        id: Date.now(), // Uniikki tunniste helpottaa käsittelyä
        name: this.programName,
        exercises: selectedExercises,
        date: new Date().toLocaleDateString('fi-FI'),
      };

      // --- POISTETETTAVA OSA ALKAA (Local Storage) ---
      // // BACKEND-MUUTOS: Poista nämä rivit kun backend on valmis
      // const existingPrograms = JSON.parse(localStorage.getItem('treeniohjelmat') || '[]');
      // existingPrograms.push(newProgram);
      // localStorage.setItem('treeniohjelmat', JSON.stringify(existingPrograms));
      // --- POISTETETTAVA OSA PÄÄTTYY ---

      // BACKEND-MUUTOS: Tähän tilalle tulee kutsu palvelimelle:
      // this.http.post('https://api.sinunpalvelin.fi/programs', newProgram).subscribe();
      // 3. Haetaan vanhat ohjelmat localStoragesta (jos niitä on)
      const existingPrograms = JSON.parse(
        localStorage.getItem('treeniohjelmat') || '[]',
      );

      // 4. Lisätään uusi ohjelma listaan ja tallennetaan takaisin
      existingPrograms.push(newProgram);
      localStorage.setItem('treeniohjelmat', JSON.stringify(existingPrograms));

      console.log('Treeni tallennettu onnistuneesti!');

      // NOLLAUS ENNEN SIIRTYMISTÄ
      this.resetSelections();

      this.router.navigate(['/page2']);
    } else {
      alert('Täytä nimi ja valitse vähintään yksi liike.');
    }
  }
}
