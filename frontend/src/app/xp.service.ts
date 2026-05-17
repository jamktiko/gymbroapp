import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { DataFetchService } from './data-fetch-service';

@Injectable({
  providedIn: 'root',
})
export class XpService {
  private progressSubject = new BehaviorSubject<number>(0);
  public progress$: Observable<number> = this.progressSubject.asObservable();
  private dataFetchService = inject(DataFetchService);

  constructor() {
    this.lataaXpProgress();
  }

  paivitaXpProgress(xp: number) {
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
  }

  lataaXpProgress() {
    this.dataFetchService.getUserDataById().subscribe({
      next: (userData) => {
        this.paivitaXpProgress(userData.xp);
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

            let currentLevel = Math.floor(Math.sqrt(currentXp / 50)) + 1;

            // Jos animaatio päättyy tasan uuden tason rajalle, pidetään palkki visuaalisesti täytenä
            if (
              currentXp === targetXp &&
              currentXp > 0 &&
              Math.sqrt(currentXp / 50) % 1 === 0
            ) {
              currentLevel -= 1;
            }
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
}
