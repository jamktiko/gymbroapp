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
  IonButton,
  IonIcon, 
} from '@ionic/angular/standalone';

// Tuodaan ikonien rekisteröintiin tarvittavat funktiot ja itse ikonit
import { addIcons } from 'ionicons'; 
import { logoGoogle, logInOutline } from 'ionicons/icons';

@Component({
  selector: 'app-page1',
  templateUrl: './page1.page.html',
  styleUrls: ['./page1.page.scss'],
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
    IonButton,
    IonIcon, // Lisätään ikoni imports-listaan
  ],
})
export class Page1Page implements OnInit {
  
  constructor() {
    /** * Jotta ikonit näkyvät Standalone-komponentissa, ne pitää 
     * "rekisteröidä" tässä constructorissa.
     */
    addIcons({ logoGoogle, logInOutline });
  }

  ngOnInit() {}

  /**
   * Tämä funktio ajetaan, kun käyttäjä painaa Google-nappia.
   * Tähän lisätään myöhemmin varsinainen kirjautumislogiikka.
   */
  _googleLogin() {
    console.log('sTässä kohtaa tapahtuisi kirjautuminen.');
  }
}