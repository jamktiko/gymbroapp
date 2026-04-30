import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, AsyncPipe } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { XpService } from '../../xp.service';

import {
  IonContent,
  IonHeader,
  IonTitle,
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
  AlertController
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { add, trashOutline } from 'ionicons/icons';

/**
 * Rajapinnat (Interfaces)
 */
interface Exercise {
  name: string;
  isSelected: boolean;
  reps?: number;
  sets?: number;
  weight?: number;
}

interface WorkoutProgram {
  id: number;
  name: string;
  exercises: Exercise[];
  date: string;
}

@Component({
  selector: 'app-page2',
  templateUrl: './page2.page.html',
  styleUrls: ['./page2.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,
    FormsModule, IonButtons, IonMenuButton, IonFab, IonFabButton,
    IonIcon, IonList, IonItem, IonLabel, IonAccordionGroup,
    IonAccordion, IonButton, IonProgressBar, AsyncPipe
  ],
})
export class Page2Page implements OnInit {
  private http = inject(HttpClient);
  savedPrograms: WorkoutProgram[] = [];
  testData: any;


  constructor(
    private router: Router, 
    private alertCtrl: AlertController,
    public xpService: XpService 
  ) {
    addIcons({ add, trashOutline });
  }

  ngOnInit() {
    // Perus-Angular alustusmetodi
    try {
      // 1. Get the object from sessionStorage
      const sessionDataStr = sessionStorage.getItem('accesstoken');
      if (sessionDataStr) {
        const sessionData = JSON.parse(sessionDataStr);
        // 2. Use sessionData.googleId for the URL. Added backend port 3000.
        const url = `http://localhost:3000/api/users/${sessionData.googleId}`; 
        
        // 3. Use sessionData.token for the Authorization header
        this.http.get(url, {
          headers: {
            'Authorization': `Bearer ${sessionData.token}`, // Only the raw token string
            'Content-Type': 'application/json'
          }
        }).subscribe({
          next: (data) => {
            this.testData = data;
            console.log('Test data loaded:', this.testData);
          },
          error: (err) => {
            console.error('Failed to load test data', err);
          }
        });
      }
    } catch (error) {
      console.error('Error loading test data:', error);
    }
  }

  ionViewWillEnter() {
    this.loadPrograms();
  }

  loadPrograms() {
    const data = localStorage.getItem('treeniohjelmat');
    if (data) {
      this.savedPrograms = JSON.parse(data) as WorkoutProgram[];
    }
  }

  async deleteProgram(programId: number, event: Event) {
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
            this.savedPrograms = this.savedPrograms.filter(p => p.id !== programId);
            localStorage.setItem('treeniohjelmat', JSON.stringify(this.savedPrograms));
          }
        }
      ]
    });
    await alert.present();
  }

  lisaaOhjelma() {
    this.router.navigate(['/page4']);
  }
}