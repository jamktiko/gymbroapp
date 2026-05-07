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

  ngOnInit() {
    this.xpService.testaaProgress();
  }

  /**
   * Tallennetaan sessio tietokantaan → XP +50
   * Sitten siirrytään takaisin pääsivulle (page2)
   */
  saveTrainingSession() {
    this.dataFetchService.createSession(this.finishedSession).subscribe({
      next: (data) => {
        console.log('hop');
        console.log('Uusi treenisessio tallennettu onnistuneesti\n' + data);
      },
      error: (err) => {
        console.error('Uuden treenisession tallennus epäonnistui:', err);
        this.router.navigate(['/page2']);
      },
    });
    this.router.navigate(['/page2']);
  }

  ionViewWillEnter() {
    this.menu.enable(false); // menu disabled tällä sivulla
  }

  ionViewWillLeave() {
    this.menu.enable(true); // varmistaa että menu seuraavassa
  }
}
