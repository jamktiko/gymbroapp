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
  public userDisplayName: string = 'User';
  public userEmail: string = 'ei kirjautunut';

  public appPages = [
    { title: 'Treenit', url: '/page2', icon: 'golf' },
    { title: 'Saavutukset', url: '/page3', icon: 'trophy' },
    { title: 'ohjelma', url: '/page5', icon: 'trophy' },
  ];

  protected router = inject(Router);
  public loadingService = inject(LoadingService);
  public authService = inject(AuthService);

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
    this.checkUserStatus();
  }

  checkUserStatus() {
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');

    if (savedName) {
      this.userDisplayName = savedName;
    }
    if (savedEmail) {
      this.userEmail = savedEmail;
    }
  }

  // ---  FUNKTIO: Kirjaudu ulos ---
  logout() {
    console.log('Kirjaudutaan ulos...');

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
