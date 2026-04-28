import { Component, ViewChild } from '@angular/core';
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
  AlertController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline,trashOutline } from 'ionicons/icons';

interface Exercise {
  name: string;
  isSelected: boolean;
  reps?: number;
  sets?: number;
  weight?: number
}

interface Category {
  title: string;
  exercises: Exercise[];
}

@Component({
  selector: 'app-page4',
  templateUrl: './page4.page.html',
  styleUrls: ['./page4.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
    IonBackButton, IonItem, IonLabel, IonInput, IonButton,
    IonAccordionGroup, IonAccordion, IonCheckbox, IonIcon, 
    CommonModule, FormsModule
  ]
})
export class LisaaTreeni {
  @ViewChild('myAccordionGroup', { static: false }) accordionGroup!: IonAccordionGroup;
  programName: string = '';

  exerciseList: Category[] = [
    {
      title: 'Rinta & Olkapäät',
      exercises: [
        { name: 'Penkkipunnerrus', isSelected: false },
        { name: 'Pystypunnerrus', isSelected: false }
      ]
    },
    {
      title: 'Jalat',
      exercises: [
        { name: 'Kyykky', isSelected: false },
        { name: 'Reiden ojennus', isSelected: false }
      ]
    }
  ];

  constructor(private router: Router, private alertCtrl: AlertController) {
    addIcons({ addOutline, trashOutline });
  }

  toggleSelection(item: Exercise) {
    item.isSelected = !item.isSelected;
  }

  /**
   * Poistaa yksittäisen harjoituksen "Omat liikkeet" -kategoriasta.
   */
  removeExercise(exerciseToRemove: Exercise) {
    const customCat = this.exerciseList.find(c => c.title === 'Omat liikkeet');
    if (customCat) {
      customCat.exercises = customCat.exercises.filter(e => e !== exerciseToRemove);
      
      // Jos viimeinenkin oma liike poistetaan, poistetaan koko kategoria listasta
      if (customCat.exercises.length === 0) {
        this.exerciseList = this.exerciseList.filter(c => c.title !== 'Omat liikkeet');
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



    this.exerciseList.forEach(category => {
      category.exercises.forEach(exercise => {
        //  Poistetaan valinta (piilottaa keltaisen laatikon ja tyhjentää checkboxin)
        exercise.isSelected = false;   // Poistetaan valinta
        exercise.sets = undefined;     // Nollataan syötetyt numerot (undefined palauttaa placeholder-tekstin)
        exercise.reps = undefined;
        exercise.weight = undefined;
      });
    });

    // Jos haluat poistaa myös käyttäjän luomat liikkeet tallennuksen jälkeen,
    // poista kommentit alta:
    // this.exerciseList = this.exerciseList.filter(c => c.title !== 'Omat liikkeet');
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
          }
        }
      ],
      buttons: [
        { text: 'Peruuta',
          role: 'cancel', 
          cssClass: 'alert-button-cancel' },
        {
          text: 'Lisää',
          cssClass: 'alert-button-confirm', 
          handler: (data) => {
            const trimmedName = data.inputValue.trim();
            if (trimmedName.length > 0 && trimmedName.length <= 30) {
              this.addNewExercise(trimmedName);
            }
          }
        }
      ]
    });
    await alert.present();
  }
  addNewExercise(newName: string) {
  let customCat = this.exerciseList.find(c => c.title === 'Omat liikkeet');
  
  if (!customCat) {
    // Luodaan uusi kategoria
    const newCategory: Category = { title: 'Omat liikkeet', exercises: [] };
    
    // TÄRKEÄÄ: Päivitetään koko taulukko levitysoperaattorilla, 
    // jotta Ionic huomaa uuden Accordion-elementin heti.
    this.exerciseList = [...this.exerciseList, newCategory];
    
    // Pakotetaan valikko auki heti luonnin jälkeen
    setTimeout(() => {
      if (this.accordionGroup) {
        this.accordionGroup.value = 'Omat liikkeet';
      }
    }, 50); // Pieni viive riittää
    
    // Etsitään juuri luotu kategoria, jotta voimme lisätä liikkeen siihen
    customCat = newCategory;
  }
  
  // Lisätään liike (isSelected: false, kuten halusit)
  customCat.exercises.push({ name: newName, isSelected: false });
}

  saveProgram() {
    const selectedExercises = this.exerciseList
      .reduce((all: Exercise[], c: Category) => all.concat(c.exercises), [])
      .filter((e: Exercise) => e.isSelected);

    if (this.programName.trim().length > 0 && selectedExercises.length > 0) {
      console.log('Tallennetaan:', this.programName, selectedExercises);
      
      // NOLLAUS ENNEN SIIRTYMISTÄ
      this.resetSelections();
      
      this.router.navigate(['/page2']);
    } else {
      alert('Täytä nimi ja valitse vähintään yksi liike.');
    }
  }
}