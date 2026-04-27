import { Component } from '@angular/core';
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
import { addOutline } from 'ionicons/icons';

/**
 * Edustaa yksittäistä harjoitusta (liikettä).
 */
interface Exercise {
  // Liikkeen selkokielinen nimi (esim. 'Penkkipunnerrus')
  name: string;
  // Pitää kirjaa siitä, onko käyttäjä valinnut tämän liikkeen ohjelmaansa.
  isSelected: boolean;
  reps?: number; // Kysymysmerkki tarkoittaa, että se on valinnainen
  sets?: number;
  weight?: number
}

/**
 * Ryhmittelee harjoitukset loogisiin kokonaisuuksiin (esim. 'Jalat').
 */
interface Category {
  // Kategorian otsikko, jota käytetään ion-accordionin otsikossa.
  title: string;
  
  // Lista Exercise-olioita, jotka kuuluvat tähän kategoriaan.
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
  programName: string = '';  // englannin kieli helpotti nimeämistä.

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
    addIcons({ addOutline });
  }

// Vaihdettu metodin nimeksi toggleSelection – kuvaa toimintaa (päälle/pois)
toggleSelection(item: Exercise) {
  item.isSelected = !item.isSelected;
  
}

/**
 * Avaa ikkunan uuden oman harjoitteen luomista varten.
 */
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
      { text: 'Peruuta', role: 'cancel' },
      {
        text: 'Lisää',
        handler: (data) => {
          // Lisävarmistus logiikan puolella
          const trimmedName = data.inputValue.trim();
          if (trimmedName.length > 0 && trimmedName.length <= 30) {
            this.addNewExercise(trimmedName);
          } else if (trimmedName.length > 30) {
            // Voit halutessasi näyttää ilmoituksen jos raja ylittyy (tosin maxlength estää tämän jo)
            console.warn("Nimi on liian pitkä");
          }
        }
      }
    ]
  });
    await alert.present();
  }

  /**
   * Lisää uuden nimen listaan.
   */
  addNewExercise(newName: string) {
    let customCat = this.exerciseList.find(c => c.title === 'Omat liikkeet');
    
    if (!customCat) {
      customCat = { title: 'Omat liikkeet', exercises: [] };
      this.exerciseList.push(customCat);
    }
    
    customCat.exercises.push({ name: newName, isSelected: true });
  }

  /**
   * Kerää valitut ja navigoi eteenpäin.
   */
 saveProgram() {
    const selectedExercises = this.exerciseList
      .reduce((all: Exercise[], c: Category) => all.concat(c.exercises), [])
      .filter((e: Exercise) => e.isSelected);

    if (this.programName.trim().length > 0 && selectedExercises.length > 0) {
      console.log('Tallennetaan:', this.programName, selectedExercises);
      this.router.navigate(['/page2']);
    } else {
      alert('Täytä nimi ja valitse vähintään yksi liike.');
    }
  }
}