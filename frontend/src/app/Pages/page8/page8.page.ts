/**
 * Saavutukset-sivu
 */

import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonProgressBar,
  IonFooter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trophy,
  flame,
  barbell,
  lockClosed,
  flash,
  medal,
  statsChart,
  fitness,
  ribbon,
} from 'ionicons/icons';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { DataFetchService } from '../../data-fetch-service';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  progress: number;
  unlocked: boolean;
  color: string;
}

interface PersonalRecord {
  muscleGroup: string;
  exercise: string;
  weight: number;
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
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonProgressBar,
    IonFooter,
    BaseChartDirective,
  ],
})
export class Page8Page implements OnInit {
  private dataFetchService = inject(DataFetchService);

  // Stats
  totalXp = 0;
  level = 1;
  xpToNextLevel = 0;
  totalSessions = 0;
  personalRecords: PersonalRecord[] = [];

  // Piirakkagraafi
  private cdr = inject(ChangeDetectorRef);
  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  };

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#ffffff', padding: 12, font: { size: 12 } },
      },
    },
  };

  // Värit lihasryhmille
  private muscleColors: Record<string, string> = {
    // Uudet nimet
    Rinta: '#ff6384',
    Selkä: '#36a2eb',
    Hartiat: '#ffce56',
    Hauis: '#4bc0c0',
    Ojentaja: '#9966ff',
    Jalat: '#ff9f40',
    Takareidet: '#c9cbcf',
    Pohkeet: '#7bc67e',
    Vatsa: '#f77825',
    Pakarat: '#e056a0',
    Olkapäät: '#ffce56',
    Ojentajat: '#9966ff',
    Hauikset: '#4bc0c0',
    Takareisi: '#c9cbcf',
    Etureidet: '#ff9f40',
  };

  // Saavutukset
  achievements: Achievement[] = [
    {
      id: 1,
      title: 'Eka treeni',
      description: 'Suorita ensimmäinen salitreenisi!',
      icon: 'flash',
      progress: 1,
      unlocked: true,
      color: 'warning',
    },
    {
      id: 2,
      title: 'Teräsmies',
      description: 'Treenaa 5 kertaa saman viikon aikana.',
      icon: 'flame',
      progress: 0.6,
      unlocked: false,
      color: 'danger',
    },
    {
      id: 3,
      title: 'Voimanpesä',
      description: 'Nosta yhteensä 1000 kg yhdessä treenissä.',
      icon: 'barbell',
      progress: 0.2,
      unlocked: false,
      color: 'tertiary',
    },
  ];

  get unlockedCount(): number {
    return this.achievements.filter((a) => a.unlocked).length;
  }

  constructor() {
    addIcons({
      trophy,
      flame,
      barbell,
      lockClosed,
      flash,
      medal,
      statsChart,
      fitness,
      ribbon,
    });
  }

  ngOnInit() {
    this.dataFetchService.getStats().subscribe({
      next: (stats) => {
        this.totalXp = stats.totalXp;
        this.level = stats.level;
        this.xpToNextLevel = stats.xpToNextLevel;
        this.totalSessions = stats.totalSessions;
        this.personalRecords = stats.personalRecords;

        // Rakennetaan piirakkagraafin data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const labels = stats.muscleDistribution.map((d: any) => d.muscleGroup);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = stats.muscleDistribution.map((d: any) => d.count);
        const colors = labels.map(
          (l: string) => this.muscleColors[l] || '#888888',
        );

        this.pieChartData = {
          labels,
          datasets: [{ data, backgroundColor: colors }],
        };
        this.cdr.detectChanges();

        // Päivitetään saavutusten progress oikealla datalla
        this.updateAchievements();
      },
      error: (err) => {
        console.error('Stats-haku epäonnistui:', err);
      },
    });
  }

  private updateAchievements() {
    // Eka treeni
    if (this.totalSessions >= 1) {
      this.achievements[0].progress = 1;
      this.achievements[0].unlocked = true;
    } else {
      this.achievements[0].progress = 0;
      this.achievements[0].unlocked = false;
    }

    // Teräsmies (5 treeniä – yksinkertaistettu versio)
    this.achievements[1].progress = Math.min(this.totalSessions / 5, 1);
    this.achievements[1].unlocked = this.totalSessions >= 5;

    // Voimanpesä (tason perusteella)
    this.achievements[2].progress = Math.min(this.level / 10, 1);
    this.achievements[2].unlocked = this.level >= 10;
  }
}
