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
import { Capacitor } from '@capacitor/core';

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

  isNative = false;

  constructor() {
    addIcons({ logoGoogle, logInOutline });
    this.isNative = Capacitor.isNativePlatform();
  }
  ionViewWillEnter() {
    this.menu.enable(false); //menu disabled
  }
  ionViewWillLeave() {
    this.menu.enable(true); //varmistaa että menu tulee takaisin seuraavalla sivulla
  }
  ngOnInit() {
    // Prevent auto-login loop by clearing the session state when arriving at the login page
    try {
      if (this.isNative) {
        GoogleAuth.signOut().catch(() => {});
      } else {
        this.socauthService.signOut().catch(() => {});
      }
    } catch (error) {
      console.error('Sign out failed on init', error);
    }

    // Initialize the native plugin only on native platforms
    if (this.isNative) {
      try {
        GoogleAuth.initialize({
          clientId: '949356362637-8k499680i9rc1pi3is0d3d2jd61lli5k.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
        });
      } catch (error) {
        console.error('Error initializing GoogleAuth:', error);
      }
    }

    // Web login using angularx-social-login
    if (!this.isNative) {
      this.socauthService.authState.subscribe((user) => {
        if (user) {
          console.log('Successfully logged in via Google button', user);
          
          if (user.idToken && user.id) {
            this.authService
              .glogin(user.idToken, user.id)
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
    }
  }
  async signInNative() {
    try {
      // This triggers the native Android Google Account picker
      const googleUser = await GoogleAuth.signIn();
      console.log('Successfully logged in natively', googleUser);

      const idToken = googleUser.authentication.idToken;
      const googleId = googleUser.id;

      if (idToken && googleId) {
        this.authService
          .glogin(idToken, googleId)
          .subscribe((result) => {
            if (result === true) {
              this.loginEventService.emitLoggedIn();
              this.router.navigateByUrl('/page2', { replaceUrl: true });
            } else {
              console.log('Väärä tunnus tai salasana');
            }
          });
      } else {
         console.error('Login failed: missing idToken or googleId');
      }
    } catch (error) {
      console.error('Google Sign-In Failed:', error);
    }
  }
}
