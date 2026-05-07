import { Component, inject, OnInit } from '@angular/core';
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
  barbellOutline,
  barbell,
  analyticsOutline,
  analytics,
  calendarNumberOutline,
  calendarNumber,
  calendarOutline,
  calendar,
} from 'ionicons/icons';
import { AuthService } from './auth.service';
import { UserData } from './types/userdata';
import { LoginEventService } from './login-event.service';
import { DataFetchService } from './data-fetch-service';

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
export class AppComponent implements OnInit {
  public userDisplayName: string = '';
  public userEmail: string = '';
  public appPages = [
    { title: 'Treenit', url: '/page2', icon: 'barbell' },
    { title: 'Saavutukset', url: '/page8', icon: 'golf' },
    { title: 'Historia', url: '/page3', icon: 'calendar' },
    { title: 'Statsit', url: '/page7', icon: 'analytics' },
  ];
  private router = inject(Router);
  public loadingService = inject(LoadingService);
  private authService = inject(AuthService);
  private userData!: UserData;
  private loginEventService = inject(LoginEventService);
  private dataFetchService = inject(DataFetchService);

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
      barbellOutline,
      barbell,
      analyticsOutline,
      analytics,
      calendarNumberOutline,
      calendarNumber,
      calendarOutline,
      calendar,
    });
  }

  ngOnInit() {
    // loginEventService ja checkUserStatus() yhdessä varmistavat että sivubarin menun käyttäjätiedot ovat ajan tasalla login ja logout tapahtumien jälkeenkin:
    this.loginEventService.loggedIn$.subscribe(() => {
      this.fetchUserData();
      return;
    });
    this.fetchUserData();
  }

  fetchUserData() {
    this.dataFetchService.getUserDataById().subscribe({
      next: (data) => {
        this.userData = data as UserData;
        console.log('User data loaded:', this.userData);

        const savedName = this.userData?.name;
        const savedEmail = this.userData?.email;

        if (savedName) {
          this.userDisplayName = savedName;
        }
        if (savedEmail) {
          this.userEmail = savedEmail;
        }
      },
      error: (err) => {
        console.error('Failed to load user data', err);
      },
    });
  }

  logout() {
    console.log('Kirjaudutaan ulos...');

    this.userDisplayName = '';
    this.userEmail = '';

    this.authService.logout();

    // 2. Ohjataan takaisin kirjautumissivulle (page1)
    // replaceUrl: true poistaa historian, jotta ei pääse "takaisin"-napilla sisään
    this.router.navigateByUrl('/page1', { replaceUrl: true }).then(() => {
      // 3. Päivitetään sivu, jotta AppComponent nollautuu (nimet ja tilat)
    });
  }
}
