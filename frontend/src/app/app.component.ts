import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonNote,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { LoadingService } from './loading.service';
import { CommonModule } from '@angular/common';
import {
  trophyOutline,
  trophy,
  exit,
  exitOutline,
  gameController,
  gameControllerOutline,
  golfOutline,
  golf,
  backspaceOutline,
  backspace,
} from 'ionicons/icons';
import { AuthService } from './auth.service';
import { UserData } from './types/userdata';
import { HttpClient } from '@angular/common/http';
import { LoginEventService } from './login-event.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    IonRouterOutlet,
    LoadingSpinnerComponent,
    CommonModule,
  ],
})
export class AppComponent {
  public userDisplayName: string = '';
  public userEmail: string = '';

  public appPages = [
    { title: 'Treenit', url: '/page2', icon: 'golf' },
    { title: 'Saavutukset', url: '/page3', icon: 'trophy' },
    { title: 'ohjelma', url: '/page5', icon: 'trophy' },
    { title: 'valmis', url: '/page6', icon: 'trophy' },
  ];

  protected router = inject(Router);
  public loadingService = inject(LoadingService);
  public authService = inject(AuthService);
  private http = inject(HttpClient);
  testData!: UserData;

  private loginEventService = inject(LoginEventService);

  constructor() {
    addIcons({
      trophyOutline,
      trophy,
      exitOutline,
      exit,
      gameController,
      gameControllerOutline,
      golfOutline,
      golf,
      backspaceOutline,
      backspace,
    });
    this.loginEventService.loggedIn$.subscribe(() => {
      this.checkUserStatus();
    });
  }

  checkUserStatus() {
    // fetch userdata from backend:
    try {
      // 1. Get the object from sessionStorage
      const sessionDataStr = sessionStorage.getItem('accesstoken');
      if (sessionDataStr) {
        const sessionData = JSON.parse(sessionDataStr);
        // 2. Use sessionData.googleId for the URL. Added backend port 3000.
        const url = `http://localhost:3000/api/users/${sessionData.googleId}`;

        // 3. Use sessionData.token for the Authorization header
        this.http
          .get(url, {
            headers: {
              Authorization: `Bearer ${sessionData.token}`, // Only the raw token string
              'Content-Type': 'application/json',
            },
          })
          .subscribe({
            next: (data) => {
              this.testData = data as UserData;
              console.log('Test data loaded:', this.testData);
              // this.loadPrograms();
              const savedName = this.testData?.name;
              const savedEmail = this.testData?.email;

              if (savedName) {
                this.userDisplayName = savedName;
              }
              if (savedEmail) {
                this.userEmail = savedEmail;
              }
            },
            error: (err) => {
              console.error('Failed to load test data', err);
            },
          });
      }
    } catch (error) {
      console.error('Error loading test data:', error);
    }
  }

  loadPrograms() {
    // throw new Error('Method not implemented.');
  }

  // ---  FUNKTIO: Kirjaudu ulos ---
  logout() {
    console.log('Kirjaudutaan ulos...');

    this.userDisplayName = '';
    this.userEmail = '';

    this.authService.logout();

    // 1. Tyhjennetään selaimen muisti
    //localStorage.removeItem('isLoggedIn');
    //localStorage.removeItem('userName');
    //localStorage.removeItem('userEmail');

    // 2. Ohjataan takaisin kirjautumissivulle (page1)
    // replaceUrl: true poistaa historian, jotta ei pääse "takaisin"-napilla sisään
    this.router.navigateByUrl('/page1', { replaceUrl: true }).then(() => {
      // 3. Päivitetään sivu, jotta AppComponent nollautuu (nimet ja tilat)
      // window.location.reload();
    });
  }
}
