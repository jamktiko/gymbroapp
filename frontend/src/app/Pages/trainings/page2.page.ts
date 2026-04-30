import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { XpService } from '../../xp.service';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonAccordionGroup,
  IonAccordion,
  IonButton,
  IonProgressBar,
  AlertController,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { add, trashOutline } from 'ionicons/icons';
import {
  Move,
  Set,
  Exercise,
  TrainingProgram,
  TrainingSession,
  UserData,
} from '../../types/userdata';

/**
 * Rajapinnat (Interfaces)
 */
// interface Exercise {
//   name: string;
//   isSelected: boolean;
//   reps?: number;
//   sets?: number;
//   weight?: number;
// }

// interface WorkoutProgram {
//   id: number;
//   name: string;
//   exercises: Exercise[];
//   date: string;
// }

@Component({
  selector: 'app-page2',
  templateUrl: './page2.page.html',
  styleUrls: ['./page2.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonMenuButton,
    IonFab,
    IonFabButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonAccordionGroup,
    IonAccordion,
    IonButton,
    IonProgressBar,
    AsyncPipe,
  ],
})
export class Page2Page implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  public xpService = inject(XpService);
  savedPrograms: TrainingProgram[] = [];
  testData!: UserData;

  constructor() {
    addIcons({ add, trashOutline });
  }

  ngOnInit() {
    // Perus-Angular alustusmetodi
  }

  ionViewWillEnter() {
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
              this.loadPrograms();
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

  async loadPrograms() {
    // const data = localStorage.getItem('treeniohjelmat');
    const data = await this.testData?.trainingPrograms;
    console.log(data);
    if (data) {
      this.savedPrograms = data;
    }
  }

  async deleteProgram(programId: string, event: Event) {
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Poistetaanko treeni?',
      message: 'Haluatko varmasti poistaa tämän treeniohjelman?',
      buttons: [
        { text: 'Peruuta', role: 'cancel' },
        {
          text: 'Poista',
          role: 'destructive',
          handler: () => {
            this.savedPrograms = this.savedPrograms.filter(
              (p) => p._id !== programId,
            );
            localStorage.setItem(
              'treeniohjelmat',
              JSON.stringify(this.savedPrograms),
            );
          },
        },
      ],
    });
    await alert.present();
  }

  lisaaOhjelma() {
    this.router.navigate(['/page4']);
  }
}
