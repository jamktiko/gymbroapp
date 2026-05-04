import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForward, checkmarkDone, timerOutline } from 'ionicons/icons';
import { TrainingProgram } from '../../types/userdata';

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
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ],
})
export class Page5Page implements OnInit, OnDestroy {
  private router = inject(Router);

  // Treenin tila
  activeWorkout!: TrainingProgram;
  currentIndex = 0;

  // Timerin tila
  timerValue: string = '00:10,00'; 
  isRunning: boolean = false;
  private timerInterval: number | undefined;
  private readonly START_SECONDS = 10;

  constructor() {
    addIcons({ arrowForward, checkmarkDone, timerOutline });
    
    // Luetaan lähetetty data
    const navigation = this.router.getCurrentNavigation();
    this.activeWorkout = navigation?.extras.state?.['activeWorkout'];
  }

  ngOnInit() {
    if (!this.activeWorkout) {
      this.router.navigate(['/page2']);
      return;
    }
    this.resetTimer(); // Alustetaan timerValue oikeaan muotoon
  }

  // Apu-getteri nykyiselle liikkeelle
  get currentExercise() {
    return this.activeWorkout?.exercises[this.currentIndex];
  }

  // Treenilogiikka
  seuraavaLiike() {
    if (this.currentIndex < this.activeWorkout.exercises.length - 1) {
      this.currentIndex++;
      this.resetTimer(); // Valmistellaan timer seuraavaa taukoa varten
    }
  }

  lopetaTreeni() {
    this.router.navigate(['/page2']);
  }

  // Timer-logiikka
  toggleTimer() {
    if (this.isRunning) {
      this.resetTimer();
    } else {
      this.startCountdown(this.START_SECONDS);
    }
  }

  private startCountdown(seconds: number) {
    this.isRunning = true;
    const endTime = Date.now() + seconds * 1000;

    this.timerInterval = setInterval(() => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        this.stopInterval();
        this.resetTimer();
        this.isRunning = false;
        return;
      }
      this.timerValue = this.formatTime(diff);
    }, 80);
  }

  private resetTimer() {
    this.stopInterval();
    this.isRunning = false;
    this.timerValue = this.formatTime(this.START_SECONDS * 1000);
  }

  private formatTime(ms: number): string {
    const totalMs = Math.max(0, ms);
    const m = Math.floor(totalMs / 60000);
    const s = Math.floor((totalMs % 60000) / 1000);
    const msRemainder = Math.floor((totalMs % 1000) / 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')},${msRemainder.toString().padStart(2, '0')}`;
  }

  private stopInterval() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
  }

  ngOnDestroy() {
    this.stopInterval();
  }
}