import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonMenuButton,
  IonTitle,
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
    IonFooter,
  ],
})
export class Page5Page implements OnDestroy {
  timerValue: string = '00:10:00'; //tällä hetkellä näyttää mikä on tauon pituus
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
