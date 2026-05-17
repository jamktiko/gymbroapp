// Saavutukset-sivu

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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonProgressBar,
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
import { DataFetchService } from '../../data-fetch-service';
import { Achievement, PersonalRecord, TrainingSession } from '../../types/userdata';

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
  ],
})
export class Page8Page implements OnInit {
  private dataFetchService = inject(DataFetchService);

  // Stats
  level = 1;
  totalSessions = 0;
  sessions: TrainingSession[] = [];

  personalRecords: PersonalRecord[] = [];

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
      description: 'Nosta yhteensä 4000 kg yhdessä treenissä.',
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
        // this.totalXp = stats.totalXp;
        this.level = stats.level;
        // this.xpToNextLevel = stats.xpToNextLevel;
        this.totalSessions = stats.totalSessions;
        this.personalRecords = stats.personalRecords;

        // Päivitetään saavutusten progress oikealla datalla
        this.updateAchievements();
      },
      error: (err) => {
        console.error('Stats-haku epäonnistui:', err);
      },
    });

    this.dataFetchService.getAllSessions().subscribe({
      next: (sessions) => {
        this.sessions = sessions;
        this.updateAchievements();
      },
      error: (err) => {
        console.error('Sessioiden haku epäonnistui:', err);
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

    // Teräsmies – 5 treeniä saman kalenteriviikon aikana
    const maxSessionsInAnyWeek = this.getMaxSessionsInAnyWeek();
    this.achievements[1].progress = Math.min(maxSessionsInAnyWeek / 5, 1);
    this.achievements[1].unlocked = maxSessionsInAnyWeek >= 5;

    // Voimanpesä – 4000 kg yhdessä treenissä
    const maxWeightInSession = this.getMaxWeightInSingleSession();
    this.achievements[2].progress = Math.min(maxWeightInSession / 4000, 1);
    this.achievements[2].unlocked = maxWeightInSession >= 4000;
  }

  /**
   * Returns the highest number of training sessions the user has done
   * within any single ISO calendar week (Mon–Sun).
   */
  private getMaxSessionsInAnyWeek(): number {
    if (!this.sessions.length) return 0;

    const weekCounts = new Map<string, number>();

    for (const session of this.sessions) {
      const key = this.getIsoWeekKey(new Date(session.datetime));
      weekCounts.set(key, (weekCounts.get(key) ?? 0) + 1);
    }

    return Math.max(...weekCounts.values());
  }

  /**
   * Returns the highest total weight (kg) lifted in any single training session.
   * Total weight = sum of (reps * weight) for every set of every exercise.
   */
  private getMaxWeightInSingleSession(): number {
    if (!this.sessions.length) return 0;

    let max = 0;
    for (const session of this.sessions) {
      let total = 0;
      for (const exercise of session.exercises) {
        for (const set of exercise.sets) {
          total += set.reps * set.weight;
        }
      }
      if (total > max) max = total;
    }
    return max;
  }

  /** Returns a "YYYY-Www" string for the ISO week containing the given date. */
  private getIsoWeekKey(date: Date): string {
    // Copy date so we don't mutate the original
    const d = new Date(date.valueOf());
    // Set to nearest Thursday: current date + 4 - current day number
    // (ISO weeks start on Monday; Thursday determines the year)
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );
    return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  }
}
