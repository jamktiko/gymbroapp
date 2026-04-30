import { Component, OnInit } from '@angular/core';
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
  savedPrograms: WorkoutProgram[] = [];

  constructor(
    private router: Router, 
    private alertCtrl: AlertController,
    public xpService: XpService 
  ) {
    addIcons({ add, trashOutline });
  }

  ngOnInit() {}

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