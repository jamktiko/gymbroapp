import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { XpService } from '../../xp.service';
import { MenuController } from '@ionic/angular/standalone';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonProgressBar,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TrainingSession } from '../../types/userdata';
import { DataFetchService } from '../../data-fetch-service';

@Component({
  selector: 'app-page6',
  templateUrl: './page6.page.html',
  styleUrls: ['./page6.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonFooter,
    IonButton,
    IonProgressBar,
  ],
})
export class Page6Page implements OnInit {
  private finishedSession: Omit<
    TrainingSession,
    '_id' | 'createdAt' | 'updatedAt' | 'datetime'
  >;
  public xpService = inject(XpService);
  private router = inject(Router);
  private dataFetchService = inject(DataFetchService);
  private menu = inject(MenuController);

  constructor() {
    // Luetaan navigoinnin mukana tullut treenidata
    const navigation = this.router.currentNavigation();
    this.finishedSession = navigation?.extras.state?.['finishedSession'];
  }

  // ngOnInit – animoidaan ensin arvio (lasketaan frontendissä)
ngOnInit() {
  const estimated = this.estimateXp(this.finishedSession?.exercises || []);
  this.xpService.animateXpGain(estimated);
}

// Sama kaava kuin backendissä, pelkkä visuaalinen arvio
private estimateXp(exercises: any[]): number {
  let xp = 0;
  for (const ex of exercises) {
    const typeBonus = ex.move?.type === 'compound' ? 5 : 2;
    for (const set of ex.sets || []) {
      if (set.weight === 0) {
        xp += set.reps * 0.5;
      } else {
        xp += (set.reps * set.weight) / 100;
      }
    }
    xp += typeBonus;
  }
  return Math.round(xp);
}

// saveTrainingSession pysyy ennallaan – backend laskee oikean XP:n


  /**
   * Tallennetaan sessio tietokantaan → XP +50
   * Sitten siirrytään takaisin pääsivulle (page2)
   */
  saveTrainingSession() {
    this.dataFetchService.createSession(this.finishedSession).subscribe({
      next: () => {
        console.log('Uusi treenisessio tallennettu onnistuneesti');
        // Päivitetään käyttäjän XP backendistä, jotta page2 näyttää oikean arvon
        this.xpService.lataaXpProgress();
        this.router.navigate(['/page2']);
      },
      error: (err) => {
        console.error('Uuden treenisession tallennus epäonnistui:', err);
        this.router.navigate(['/page2']);
      },
    });
  }

  ionViewWillEnter() {
    this.menu.enable(false); // menu disabled tällä sivulla
  }

  ionViewWillLeave() {
    this.menu.enable(true); // varmistaa että menu seuraavassa
  }
}
