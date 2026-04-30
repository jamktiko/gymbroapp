import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonFooter,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-page8',
  templateUrl: './page8.page.html',
  styleUrls: ['./page8.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonMenuButton,
    IonFooter,
  ],
})
export class Page8Page implements OnInit {
  constructor() {}

  ngOnInit() {}
}
