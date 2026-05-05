
import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton]
})
export class TimerComponent implements OnDestroy, OnChanges {
  // --- INPUTIT JA OUTPUTIT ---
  
  // Mahdollistaa lepoajan asettamisen sivulta: <app-timer [duration]="30"></app-timer>
  @Input() duration: number = 10; 

  // Ilmoittaa sivulle, kun aika on loppunut (jos haluat esim. soittaa äänen)
  @Output() timerFinished = new EventEmitter<void>();

  // --- KELLON SISÄINEN TILA ---
  timerValue: string = '00:10,00'; // Alustetaan oletusarvolla
  isRunning: boolean = false;
  private timerInterval: number | undefined;

  constructor() {}

  /**
   * Angular kutsuu tätä, kun @Input-arvo muuttuu. 
   * Varmistaa, että kello päivittyy, jos liike vaihtuu ja siinä on eri lepoaika.
   */
  ngOnChanges() {
    this.resetTimer();
  }

  /**
   * Käynnistää tai nollaa timerin.
   */
  toggleTimer() {
    if (this.isRunning) {
      this.resetTimer();
    } else {
      this.startCountdown(this.duration);
    }
  }

  /**
   * Laskentalogiikka sadasosien tarkkuudella.
   */
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
        this.timerFinished.emit(); // Lähetetään tieto ajan loppumisesta
        return;
      }
      this.timerValue = this.formatTime(diff);
    }, 80);
  }

  /**
   * Nollaa kellon alkuperäiseen kestoon (duration).
   */
  resetTimer() {
    this.stopInterval();
    this.isRunning = false;
    this.timerValue = this.formatTime(this.duration * 1000);
  }

  /**
   * Muuntaa millisekunnit muotoon MM:SS,ms
   */
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

  /**
   * Huolehtii muistinhallinnasta: pysäyttää ajastimen, kun komponentti poistetaan.
   */
  ngOnDestroy() {
    this.stopInterval();
  }
}