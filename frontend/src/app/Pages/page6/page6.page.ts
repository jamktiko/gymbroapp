import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonProgressBar,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-page6',
  templateUrl: './page6.page.html',
  styleUrls: ['./page6.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonFooter,
    IonButton,
    IonProgressBar,
  ],
})
export class Page6Page implements OnInit {
  public progress = 0;

  constructor(private router: Router) {
    this.kaynnistaProgress();
  }

  ngOnInit() {}
  //tämä vasta demo
  kaynnistaProgress() {
    setInterval(() => {
      this.progress += 0.01;
      // Resets the progress bar when it reaches 100%
      if (this.progress > 1) {
        setTimeout(() => {
          this.progress = 0;
        }, 1000);
      }
    }, 20);
  }

  aloitussivulle() {
    this.router.navigate(['/page2']);
  }
}
