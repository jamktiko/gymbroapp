import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router'; // Lisätty Router
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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true, // Varmistetaan standalone-tila
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
  ],
})
export class AppComponent {
  public userDisplayName: string = 'User'; 
  public userEmail: string = 'ei kirjautunut';

  public appPages = [
    { title: 'Treenit', url: '/page2', icon: 'golf' },
    { title: 'Saavutukset', url: '/page3', icon: 'trophy' },
  ]

  // Lisätty Router constructorin argumentiksi (private router: Router)
  constructor(private router: Router) {
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
    
    // 1. Tyhjennetään selaimen muisti
    //localStorage.removeItem('isLoggedIn');
    //localStorage.removeItem('userName');
    //localStorage.removeItem('userEmail');

    // 2. Ohjataan takaisin kirjautumissivulle (page1)
    // replaceUrl: true poistaa historian, jotta ei pääse "takaisin"-napilla sisään
    this.router.navigateByUrl('/page1', { replaceUrl: true }).then(() => {
      // 3. Päivitetään sivu, jotta AppComponent nollautuu (nimet ja tilat)
      window.location.reload();
    });
  }
}