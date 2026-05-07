import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonProgressBar,
  IonText,
  IonFooter
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trophy, flame, barbell, lockClosed, flash, medal } from 'ionicons/icons';
import { DataFetchService } from '../../data-fetch-service';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  progress: number; // 0.0 - 1.0
  unlocked: boolean;
  color: string;
}

@Component({
  selector: 'app-page8',
  templateUrl: './page8.page.html',
  styleUrls: ['./page8.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonProgressBar,
    IonText,
    IonFooter
  ],
})
export class Page8Page implements OnInit {
  private dataFetchService = inject(DataFetchService);
  
  achievements: Achievement[] = [
    {
      id: 1,
      title: 'Eka treeni',
      description: 'Suoritit ensimmäisen salitreenisi!',
      icon: 'flash',
      progress: 1,
      unlocked: true,
      color: 'warning'
    },
    {
      id: 2,
      title: 'Teräsmies',
      description: 'Treenannut 5 kertaa tällä viikolla.',
      icon: 'flame',
      progress: 0.6,
      unlocked: false,
      color: 'danger'
    },
    {
      id: 3,
      title: 'Voimanpesä',
      description: 'Nosta yhteensä 1000kg yhdessä treenissä.',
      icon: 'barbell',
      progress: 0.2,
      unlocked: false,
      color: 'tertiary'
    }
  ]; 

  
  get unlockedCount(): number {
    return this.achievements.filter(a => a.unlocked).length;
  }

  constructor() {
    addIcons({ trophy, flame, barbell, lockClosed, flash, medal });
  }

  ngOnInit() {}
}