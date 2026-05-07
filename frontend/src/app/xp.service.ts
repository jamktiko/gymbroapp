// import { HttpClient } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, map, takeWhile } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class XpService {
  private progressSubject = new BehaviorSubject<number>(1); //sivun alkuarvo 100%
  public progress$: Observable<number> = this.progressSubject.asObservable();
  // private http = inject(HttpClient);
  // private readonly API_URL =
  // Tarvitsee APIN?

  constructor() {}

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
  // Frontend-testaus
  testaaProgress() {
    this.progressSubject.next(0); // Nollataan alkuun
    const demoCall = interval(40).pipe(
      map((i) => (i + 1) / 100), // Kasvattaa 0.01 välein
      takeWhile((val) => val <= 1.0), // Lopettaa 100 prosenttiin
    );

    demoCall.subscribe((val) => {
      this.progressSubject.next(val);
    });
  }
}
