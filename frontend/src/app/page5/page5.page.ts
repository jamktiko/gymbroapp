import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonToolbar,
} from '@ionic/angular/standalone';

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
  ],
})
export class Page5Page implements OnDestroy {
  timerValue: string = '00:10'; //tällä hetkellä näyttää mikä taukoaika
  isRunning: boolean = false;

  private timerInterval: any;
  private readonly START_SECONDS = 10; //vaihtaa ajan

  constructor() {}
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
    }, 100);
  }

  private resetTimer() {
    this.stopInterval();
    this.isRunning = false;
    this.timerValue = this.formatTime(this.START_SECONDS * 1000);
  }

  private formatTime(ms: number): string {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
