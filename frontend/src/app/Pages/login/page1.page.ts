/**
 * Login näkymä
 */

import { Component, inject, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, IonButton, IonIcon } from '@ionic/angular/standalone'; //tuodaan menucontroller jotta voidaan disable menu
import { IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoGoogle, logInOutline } from 'ionicons/icons';
import {
  SocialAuthService,
  GoogleSigninButtonModule,
  SocialUser,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { AuthService } from '../../auth.service';
import { LoginEventService } from '../../login-event.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'; // Import Native Plugin

@Component({
  selector: 'app-page1',
  templateUrl: './page1.page.html',
  styleUrls: ['./page1.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    GoogleSigninButtonModule,
    SocialLoginModule,
    IonButton,
    IonIcon,
  ],
})
export class Page1Page implements OnInit {
  private socauthService = inject(SocialAuthService);
  private authService = inject(AuthService);
  private menu = inject(MenuController);
  private user!: SocialUser;
  private router = inject(Router);
  private loginEventService = inject(LoginEventService);
  public loggedInEvent = output<void>();

  constructor() {
    addIcons({ logoGoogle, logInOutline });
  }
  ionViewWillEnter() {
    this.menu.enable(false); //menu disabled
  }
  ionViewWillLeave() {
    this.menu.enable(true); //varmistaa että menu tulee takaisin seuraavalla sivulla
  }
  ngOnInit() {
    // Initialize the native plugin
    GoogleAuth.initialize();

    /**
    this.socauthService.signOut();
    this.authService.logout();
 
    this.socauthService.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        console.log('Successfully logged in via Google button', user);
 
         // Lähetetään glogin-metodilla Googlen idToken backendiin josta saadaan JWT
         // Myös userin id annetaan authServicelle, jotta sitä voidaan verrata siellä
         // backendistä saatuun userin id:hen.
       
 
        if (this.user != null) {
          this.authService
            .glogin(this.user.idToken!, this.user.id!)
            .subscribe((result) => {
              if (result === true) {
                this.loginEventService.emitLoggedIn();
                this.router.navigateByUrl('/page2', { replaceUrl: true });
              } else {
                console.log('Väärä tunnus tai salasana');
              }
            });
        }
      }
    });
    */
  }

  async signInNative() {
    try {
      // This triggers the native Android Google Account picker
      const googleUser = await GoogleAuth.signIn();
      console.log('Successfully logged in natively', googleUser);

      // googleUser.authentication.idToken is what you send to your backend
      // googleUser.id is the unique Google ID

      this.authService
        .glogin(googleUser.authentication.idToken, googleUser.id)
        .subscribe((result) => {
          if (result === true) {
            this.loginEventService.emitLoggedIn();
            this.router.navigateByUrl('/page2', { replaceUrl: true });
          } else {
            console.log('Väärä tunnus tai salasana');
          }
        });
    } catch (error) {
      console.error('Google Sign-In Failed:', error);
    }
  }
}
