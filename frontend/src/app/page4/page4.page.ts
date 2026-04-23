import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-page4',
  templateUrl: './page4.page.html',
  styleUrls: ['./page4.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonButton, 
    CommonModule, 
    FormsModule
  ]
})
export class Page4Page {
  treeniNimi: string = '';

  constructor(private router: Router) {}

  tallenna() {
    if (this.treeniNimi.trim().length > 0) {
      console.log('Tallennetaan treeni:', this.treeniNimi);
      // Tässä kohtaa myöhemmin kutsu backendille
      this.router.navigate(['/page2']);
    }
  }
}