/**
 * Login näkymä
 */

import { Component, inject, OnInit, output, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular/standalone'; //tuodaan menucontroller jotta voidaan disable menu
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoGoogle, logInOutline } from 'ionicons/icons';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { AuthService } from '../../auth.service';
import { LoginEventService } from '../../login-event.service';
@Component({
  selector: 'app-page1',
  templateUrl: './page1.page.html',
  styleUrls: ['./page1.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    CommonModule,
    FormsModule,
  ],
})
export class Page1Page implements OnInit {
  private ngZone = inject(NgZone);
  private authService = inject(AuthService);
  private menu = inject(MenuController);
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

  async onGoogleLoginClick() {
    try {
      GoogleAuth.initialize({
        clientId: '949356362637-8k499680i9rc1pi3is0d3d2jd61lli5k.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });

      const result = await GoogleAuth.signIn();
      console.log('Google Sign-In successful, full result:', result);
      console.log('Authentication object:', result.authentication);

      if (result && result.authentication) {
        const idToken = result.authentication.idToken;
        console.log('idToken extracted:', idToken ? 'present' : 'null');

        let googleId: string | null = null;
        if (idToken) {
          const parsed = this.parseJwt(idToken);
          console.log('Parsed JWT:', parsed);
          if (parsed && typeof parsed.sub === 'string') {
            googleId = parsed.sub;
          }
          console.log('Extracted googleId (sub):', googleId);
        }

        if (idToken && googleId) {
          console.log('Calling authService.glogin with:', { idToken: idToken.substring(0, 50) + '...', googleId });
          
          this.authService
            .glogin(idToken, googleId)
            .subscribe({
              next: (loginResult) => {
                console.log('glogin result:', loginResult);
                if (loginResult === true) {
                  this.ngZone.run(() => {
                    console.log('Login successful, navigating to page2');
                    this.loginEventService.emitLoggedIn();
                    this.router.navigate(['/page2']).then(() => {
                      console.log('Navigation complete');
                    });
                  });
                } else {
                  console.log('Backend authentication failed, loginResult:', loginResult);
                }
              },
              error: (error) => {
                console.error('glogin error:', error);
                console.error('glogin error status:', error?.status);
                console.error('glogin error message:', error?.message);
                console.error('glogin error body:', error?.error);
              },
            });
        } else {
          console.log('Missing idToken or googleId', { idToken: !!idToken, googleId: !!googleId });
        }
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
    }
  }

  private parseJwt(token: string): { sub?: string } | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as { sub?: string };
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }

  ngOnInit() {
    // Initialize GoogleAuth
    try {
      GoogleAuth.initialize({
        clientId: '949356362637-8k499680i9rc1pi3is0d3d2jd61lli5k.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
    } catch (error) {
      console.error('Error initializing GoogleAuth:', error);
    }
  }
}
