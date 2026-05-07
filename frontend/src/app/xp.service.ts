import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { DataFetchService } from './data-fetch-service';

@Injectable({
  providedIn: 'root',
})
export class XpService {
  private progressSubject = new BehaviorSubject<number>(0); //sivun alkuarvo
  public progress$: Observable<number> = this.progressSubject.asObservable();
  private dataFetchService = inject(DataFetchService);

  constructor() {
    this.lataaXpProgress();
  }

  lataaXpProgress() {
    this.dataFetchService.getUserDataById().subscribe({
      next: (userData) => {
        const xp = userData.xp;
        const xpToNextLevel = userData.xpToNextLevel;
        const totalXp = xpToNextLevel + xp;

        const progress = totalXp > 0 ? xp / totalXp : 0;
        this.progressSubject.next(progress);
      },
      error: (err: unknown) => {
        console.error('Backend ei vastannut:', err);
      },
    });
  }

  // Frontend-testaus ja animaatio page6:een
  animateXpGain(xpGain: number = 50) {
    this.dataFetchService.getUserDataById().subscribe({
      next: (userData) => {
        const startXp = userData.xp;
        const targetXp = startXp + xpGain;

        let currentXp = startXp;
        const steps = 40;
        const stepAmount = xpGain / steps;

        const sub = interval(30).subscribe({
          next: () => {
            currentXp += stepAmount;

            if (currentXp >= targetXp) {
              currentXp = targetXp; // varmistetaan että ei mennä yli
              sub.unsubscribe();
            }

            const currentLevel = Math.floor(Math.sqrt(currentXp / 50)) + 1;
            const currentTotalXp = currentLevel ** 2 * 50;
            const progress =
              currentTotalXp > 0 ? currentXp / currentTotalXp : 0;

            this.progressSubject.next(progress);
          },
        });
      },
      error: (err: unknown) => {
        console.error('Animaatio epäonnistui (backend ei vastannut):', err);
      },
    });
  }

  // Backend-juttu, kannattaa varmistaa toimiiko oikeesti jossain vaiheessa, hyvin mahdollista että tehty väärin

  /*

  lataaBackend() {
    this.http.get<{ progressPercentage: number }>(this.API_URL).subscribe({
      next: (res) => {
        // palkki pitää päivittää backend puolelta, varmistus miten oikeasti toimii
        this.progressSubject.next(res.mikäonkaanimeltään);
      },
      error: (err: any) => {
        console.error('Backend ei vastannut:', err);
        // haku epäonnistu, error
      },
    });
  } 

  */
}
