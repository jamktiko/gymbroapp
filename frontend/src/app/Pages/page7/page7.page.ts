import { Component, OnInit, inject } from '@angular/core';
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
  IonIcon,
  IonButton,
  IonCard,      // Lisätty kortti-komponentteja
  IonCardContent
} from '@ionic/angular/standalone';
import { XpService } from '../../xp.service';
import { addIcons } from 'ionicons'; // Tarvitaan ikonien rekisteröintiin
import { flame, checkmarkCircle, ellipseOutline } from 'ionicons/icons';
import { DataFetchService } from '../../data-fetch-service';
import { UserData } from '../../types/userdata';

@Component({
  selector: 'app-page7',
  templateUrl: './page7.page.html',
  styleUrls: ['./page7.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, 
    FormsModule, IonButtons, IonMenuButton, IonFooter, IonIcon, 
    IonButton, IonCard, IonCardContent
  ],
})
export class Page7Page implements OnInit {
  public userData!: UserData;// Tähän tallennetaan backendiltä haettu data, tyyppi määriteltävä myöhemmin
  private dataFetchService = inject(DataFetchService);
  public xpService = inject(XpService);

  // PLACEHOLDER BACKENDILLE:
  // Tähän tulee myöhemmin data
  public streakData = {
    current: 3,
    weeklyActivity: [
      { day: 'Ma', active: true },
      { day: 'Ti', active: true },
      { day: 'Ke', active: true },
      { day: 'To', active: false },
      { day: 'Pe', active: false },
      { day: 'La', active: false },
      { day: 'Su', active: false }
    ]
  };

  constructor() {
    // Rekisteröidään ikonit
    addIcons({ flame, checkmarkCircle, ellipseOutline });
  }

  ngOnInit() {
    this.fetchUserData();
  }

  fetchUserData() {
    this.dataFetchService.getUserDataById().subscribe({
      next: (data) => {
        console.log('User data fetched:', data);
        this.userData = data;
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      }
    });
  }}