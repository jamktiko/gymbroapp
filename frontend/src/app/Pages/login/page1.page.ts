import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon, 
} from '@ionic/angular/standalone';

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
    IonButton,
    IonIcon,
  ],
})
export class Page1Page implements OnInit {
  
  constructor(private router: Router) {
    addIcons({ logoGoogle, logInOutline });
  }

  ngOnInit() {}

  async _googleLogin() {  // TÄNNE GOOGLE-KIRJAUTUMISLOHKO
    console.log('Kirjautumispainiketta painettu.');
  localStorage.setItem('isLoggedIn', 'true'); // Tallennetaan tieto
  


    // --- TESTIKOODI ALKAA ---
    // Poista kommentit alta, jos haluat testata nimen vaihtumista:
    //localStorage.setItem('userName', 'Gymbro');
    //localStorage.setItem('userEmail', 'Testo@power.com');
    //localStorage.setItem('isLoggedIn', 'true');
    // --- TESTIKOODI PÄÄTTYY ---
    
    // Navigoidaan sivulle 2
    // Jos käytit yllä olevaa testikoodia, voit lisätä navigateByUrl:n perään
    // .then(() => window.location.reload()); jotta nimi päivittyy heti.
    this.router.navigateByUrl('/page2', { replaceUrl: true });//.then(() => window.location.reload());
  }
}