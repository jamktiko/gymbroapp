import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonMenuButton, 
  IonFooter, 
  IonFab,      
  IonFabButton, 
  IonIcon      
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
    IonFooter,
    IonFab,      
    IonFabButton, 
    IonIcon      
  ],
})
export class Page2Page implements OnInit {
  
  // TÄSSÄ ON "VALE-BACKEND": 
  // Kun backend on valmis, tämä muuttuja täytetään palvelimelta tulevalla datalla.
  public user = {
    firstName: 'Päällikkö',
    lastName: 'Gymbro',
    id: '12345'
  };

  constructor() {
    addIcons({ add });
  }

  ngOnInit() {
    // Tällä hetkellä emme tee tässä mitään, 
    // koska käytämme yllä olevaa 'user'-objektia.
  }

  lisaaOhjelma() {
    console.log('Plus-painiketta painettu!');
  }
}