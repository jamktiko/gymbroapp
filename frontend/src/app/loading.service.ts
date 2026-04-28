import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// holds logic whether application is currently "loading"
// acts as bridge between the interceptor and the UI
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingCount = 0;
  loading$ = new BehaviorSubject<boolean>(false);

  show() {
    this.loadingCount++;
    this.loading$.next(true);
  }

  hide() {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.loading$.next(false);
    }
  }
}
