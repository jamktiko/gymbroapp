import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonMenuButton,
  IonToolbar,
  IonTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForward, checkmarkDone, timerOutline } from 'ionicons/icons';
import { TrainingProgram } from '../../types/userdata';
import { TimerComponent } from '../../timer/timer.component';

@Component({
  selector: 'app-page5',
  templateUrl: './page5.page.html',
  styleUrls: ['./page5.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonFooter,
    IonTitle,
    IonIcon,
    TimerComponent, // Lisätty importteihin
  ],
})
export class Page5Page implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  @ViewChild('workoutTimer') timer!: TimerComponent;
  // --- TREENIN TILA ---
  public activeWorkoutReordered!: TrainingProgram;
  public activeWorkoutOriginal!: TrainingProgram;
  public currentIndex = 0;

  constructor() {
    addIcons({ arrowForward, checkmarkDone, timerOutline });

    // Luetaan navigoinnin mukana tullut treenidata
    const navigation = this.router.currentNavigation();
    this.activeWorkoutReordered =
      navigation?.extras.state?.['activeWorkoutReordered'];
  }

  ngOnInit() {
    // Aloitetaan aina alusta ja varmistetaan datan löytyminen
    this.currentIndex = 0;

    if (!this.activeWorkoutReordered) {
      this.router.navigate(['/page2']);
    }
  }

  /**
   * Palauttaa  liikkeen datan.
   */
  get currentExercise() {
    return this.activeWorkoutReordered?.exercises[this.currentIndex];
  }

  // --- TREENILOGIIKKA ---

  /**
   * Siirtyy seuraavaan liikkeeseen.
   * Timer nollautuu automaattisesti komponentin sisällä, kun se saa uuden inputin.
   */
  seuraavaLiike() {
    // 1. PYSÄYTETÄÄN JA NOLLATAAN KELLO
    if (this.timer) {
      this.timer.forceStopAndReset();
    }

    // 2. SIIRRYTÄÄN SEURAAVAAN LIIKKEESEEN
    if (
      this.currentIndex <
      (this.activeWorkoutReordered?.exercises?.length || 0) - 1
    ) {
      this.currentIndex++;
    }
  }
  /**
   * Päättää treenin ja siirtyy XP-sivulle.
   */
  lopetaTreeni() {
    // Tallennetaan sessio backendiin → XP +50
    const session = {
      exercises: this.activeWorkoutReordered.exercises,
    };

    this.http
      .post('http://localhost:3000/api/training-sessions', session)
      .subscribe({
        next: () => {
          // Pysäytetään kello myös tässä
          if (this.timer) {
            this.timer.forceStopAndReset();
          }

          this.currentIndex = 0;
          this.router.navigate(['/page6'], { replaceUrl: true });
        },
        error: (err) => {
          console.error('Session tallennus epäonnistui:', err);
          // Navigoi silti eteenpäin
          this.router.navigate(['/page6'], { replaceUrl: true });
        },
      });
  }
}
