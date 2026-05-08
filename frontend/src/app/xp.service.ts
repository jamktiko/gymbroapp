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

        // Lasketaan käyttäjän nykyinen level, sekä sen tason vaatima alku- ja loppu-xp
        const currentLevel = Math.floor(Math.sqrt(xp / 50)) + 1;
        const levelStartXp = (currentLevel - 1) ** 2 * 50;
        const levelEndXp = currentLevel ** 2 * 50;

        // Kuinka paljon XP:tä tällä tasolla on kerätty ja kuinka paljon taso vaatii yhteensä
        const xpEarnedInLevel = xp - levelStartXp;
        const levelTotalXpSize = levelEndXp - levelStartXp;

        const progress =
          levelTotalXpSize > 0 ? xpEarnedInLevel / levelTotalXpSize : 0;
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
            const levelStartXp = (currentLevel - 1) ** 2 * 50;
            const levelEndXp = currentLevel ** 2 * 50;

            const xpEarnedInLevel = currentXp - levelStartXp;
            const levelTotalXpSize = levelEndXp - levelStartXp;

            const progress =
              levelTotalXpSize > 0 ? xpEarnedInLevel / levelTotalXpSize : 0;

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
