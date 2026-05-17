// XP-sivu

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { XpService } from '../../xp.service';
import {
  IonButton,
  IonContent,
  IonProgressBar,
  MenuController,
} from '@ionic/angular/standalone';
import { TrainingSession } from '../../types/userdata';
import { DataFetchService } from '../../data-fetch-service';

@Component({
  selector: 'app-page6',
  templateUrl: './page6.page.html',
  styleUrls: ['./page6.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, IonProgressBar],
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

  ngOnInit() {
    // Haetaan nykyinen XP ja animoidaan siihen 50 XP lisää,
    // koska treenin suorittaminen antaa oletuksena 50 XP.
    this.xpService.animateXpGain(50);
  }

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
