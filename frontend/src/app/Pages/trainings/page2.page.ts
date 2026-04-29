import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Reititin takaisin

import {
  IonContent,
  IonHeader,
  IonTitle,
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
  IonAccordion
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

// Määritellään liikkeen rakenne
interface Exercise {
  name: string;
  isSelected: boolean;
  reps?: number;
  sets?: number;
  weight?: number;
}

// Määritellään treeniohjelman rakenne
interface WorkoutProgram {
  id: number;
  name: string;
  exercises: Exercise[];
  date: string;
}

@Component({
  selector: 'app-page2',
  templateUrl: './page2.page.html',
  styleUrls: ['./page2.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
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
    IonAccordion
  ],
})
export class Page2Page implements OnInit {
  // Lista, johon Local Storagesta haetut ohjelmat tallennetaan
  savedPrograms: WorkoutProgram[] = [];
 

  constructor(private router: Router) {
    addIcons({ add });
  }

  ngOnInit() {}


  // Ionicin elinkaarimetodi: ajetaan joka kerta kun sivu ladataan näkyviin
  ionViewWillEnter() {
    this.loadPrograms();
  }


  // Haetaan tiedot selaimen muistista. // BACKEND-MUUTOS: Poista 'loadPrograms' sisältö ja korvaa se 
  // --- POISTETTAVA OSA ALKAA ---
  // // BACKEND-MUUTOS: Tämä koodi lähtee pois
  // const data = localStorage.getItem('treeniohjelmat');
  // if (data) {
  //   this.savedPrograms = JSON.parse(data) as WorkoutProgram[];
  // }
  // --- POISTETTAVA OSA PÄÄTTYY ---

  // BACKEND-MUUTOS: Tähän tilalle tulee kutsu:
  // this.http.get<WorkoutProgram[]>('api/url/täällä').subscribe(res => {
  //   this.savedPrograms = res;
  // });
  loadPrograms() {
    const data = localStorage.getItem('treeniohjelmat');
    if (data) {
      this.savedPrograms = JSON.parse(data);
    }
  }


  // Tämä funktio ohjaa käyttäjän uudelle sivulle
  lisaaOhjelma() {
    this.router.navigate(['/page4']);
  }
}
