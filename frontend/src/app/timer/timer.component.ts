import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton]
})
export class TimerComponent implements OnDestroy, OnChanges {
  @Input() duration: number = 10; 
  @Output() timerFinished = new EventEmitter<void>();

  timerValue: string = '00:10,00';
  isRunning: boolean = false;
  private timerInterval: ReturnType<typeof setInterval> | undefined; // Käytetään any, jotta toimii ympäristöstä riippumatta

  constructor() {}

  /**
   * MUOKATTU: Tarkistetaan muutokset tarkemmin.
   */
  ngOnChanges(changes: SimpleChanges) {
    // Jos duration-arvo muuttuu, pysäytetään ja nollataan kello välittömästi
    if (changes['duration']) {
      this.forceStopAndReset();
    }
  }

  /**
   * Pysäyttää ajastimen ja pakottaa tilan falseksi.
   */
  forceStopAndReset() {
    this.stopInterval();
    this.isRunning = false;
    this.timerValue = this.formatTime(this.duration * 1000);
  }

  toggleTimer() {
    if (this.isRunning) {
      // Jos kello käy, nappi pysäyttää ja nollaa sen
      this.forceStopAndReset();
    } else {
      // Jos kello on pysähdyksissä, käynnistetään se
      this.startCountdown(this.duration);
    }
  }

  private startCountdown(seconds: number) {
    this.isRunning = true;
    const endTime = Date.now() + seconds * 1000;

    // Varmistetaan, ettei päällekkäisiä intervalleja ole
    this.stopInterval();

    this.timerInterval = setInterval(() => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        this.forceStopAndReset();
        this.timerFinished.emit();
        return;
      }
      this.timerValue = this.formatTime(diff);
    }, 80);
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