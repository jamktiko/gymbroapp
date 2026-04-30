import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginEventService {
  private loggedInSource = new Subject<void>();
  loggedIn$ = this.loggedInSource.asObservable();

  emitLoggedIn() {
    this.loggedInSource.next();
  }
}
