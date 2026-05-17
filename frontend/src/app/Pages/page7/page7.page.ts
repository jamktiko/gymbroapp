// Tilastot-sivu

import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  flame,
  barbell,
  fitness,
  flash,
  lockClosed,
  medal,
  ribbon,
  statsChart,
  trophy,
} from 'ionicons/icons';
import { DataFetchService } from '../../data-fetch-service';
import { XpService } from '../../xp.service';
import { UserData } from '../../types/userdata';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-page7',
  templateUrl: './page7.page.html',
  styleUrls: ['./page7.page.scss'],
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
    IonCard,
    IonCardContent,
    BaseChartDirective,
    IonCardHeader,
    IonCardTitle,
  ],
})
export class Page7Page implements OnInit {
  public userData!: UserData; // Tähän tallennetaan backendiltä haettu data, tyyppi määriteltävä myöhemmin
  private dataFetchService = inject(DataFetchService);
  public xpService = inject(XpService);

  // Stats
  totalXp = 0;
  level = 1;
  xpToNextLevel = 0;
  totalSessions = 0;

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
          datasets: [
            {
              data,
              backgroundColor: colors,
              borderWidth: 1,
              borderColor: '#000000',
            },
          ],
        };

        this.cdr.detectChanges();

        this.dataFetchService.getUserDataById().subscribe({
          next: (data) => {
            // console.log('User data fetched:', data);
            this.userData = data;
          },
          error: (err) => {
            console.error('Error fetching user data:', err);
          },
        });

        // Päivitetään saavutusten progress oikealla datalla
        // this.updateAchievements();
      },
      error: (err) => {
        console.error('Stats-haku epäonnistui:', err);
      },
    });
  }
}
