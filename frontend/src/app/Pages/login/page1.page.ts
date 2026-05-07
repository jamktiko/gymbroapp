import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-page1',
  templateUrl: './page1.page.html',
  styleUrls: ['./page1.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon],
})
export class Page1Page {
  private router = inject(Router);

  loginWithGoogle(): void {
    this.router.navigate(['/page2']);
  }
}
