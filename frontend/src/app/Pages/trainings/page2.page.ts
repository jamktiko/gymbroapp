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
<<<<<<< HEAD:frontend/src/app/page2/page2.page.ts
=======
  IonFooter,
>>>>>>> main:frontend/src/app/Pages/trainings/page2.page.ts
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

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
<<<<<<< HEAD:frontend/src/app/page2/page2.page.ts
=======
    IonFooter,
>>>>>>> main:frontend/src/app/Pages/trainings/page2.page.ts
    IonFab,
    IonFabButton,
    IonIcon,
  ],
})
export class Page2Page implements OnInit {
  /* public user = {
    firstName: 'Päällikkö',
    lastName: 'Gymbro',
    id: '12345'
  };
  */

  constructor(private router: Router) {
    addIcons({ add });
  }

  ngOnInit() {}

  // Tämä funktio ohjaa käyttäjän uudelle sivulle
  lisaaOhjelma() {
    this.router.navigate(['/page4']);
  }
<<<<<<< HEAD:frontend/src/app/page2/page2.page.ts
=======
  page5temp() {
    this.router.navigate(['/page5']);
  }
>>>>>>> main:frontend/src/app/Pages/trainings/page2.page.ts
}
