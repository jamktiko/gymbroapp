import { Component, inject, OnInit } from '@angular/core';
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
import {
  GoogleLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { AuthService } from '../auth.service';

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
  private socauthService = inject(SocialAuthService);
  private authService = inject(AuthService);

  constructor(private router: Router) {
    addIcons({ logoGoogle, logInOutline });
  }

  ngOnInit() {
    this._googleLogin();
  }

  async _googleLogin() {
    this.socauthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((user) => {
        console.log('Successfully logged in via custom button', user);
        // The authState subscription in your ngOnInit/signInGoogle will
        // still catch this user change and handle the backend sending!
      })
      .catch((error) => {
        console.error('Google sign-in error:', error);
        // this.error = 'Google kirjautuminen epäonnistui';
      });

    // console.log('Kirjautumispainiketta painettu.');
    // localStorage.setItem('isLoggedIn', 'true'); // Tallennetaan tieto

    // --- TESTIKOODI ALKAA ---
    // Poista kommentit alta, jos haluat testata nimen vaihtumista:
    //localStorage.setItem('userName', 'Arnold Gymbro');
    //localStorage.setItem('userEmail', 'arnold@power.com');
    //localStorage.setItem('isLoggedIn', 'true');
    // --- TESTIKOODI PÄÄTTYY ---

    // Navigoidaan sivulle 2
    // Jos käytit yllä olevaa testikoodia, voit lisätä navigateByUrl:n perään
    // .then(() => window.location.reload()); jotta nimi päivittyy heti.
    this.router.navigateByUrl('/page2', { replaceUrl: true }); //.then(() => window.location.reload());
  }
}
