import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DataFetchService } from '../../data-fetch-service';
import { addIcons } from 'ionicons';
import { checkmarkCircle, chevronBackOutline, chevronForwardOutline, } from 'ionicons/icons';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  view: 'month' | 'week' = 'month';
  today = new Date();
  currentDate = new Date();
  workoutDates = new Set<string>();
  weeks: Date[][] = [];
  weekDays: Date[] = [];

  constructor(private dataFetchService: DataFetchService) {

  addIcons({ checkmarkCircle, chevronBackOutline, chevronForwardOutline });
  }

  ngOnInit() {
    this.dataFetchService.getCalendarDates().subscribe((dates) => {
      this.workoutDates = new Set(dates);
      this.buildCalendar();
    });
  }

  buildCalendar() {
    this.view === 'month' ? this.buildMonth() : this.buildWeek();
  }

  buildMonth() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const start = new Date(firstDay);
    start.setDate(start.getDate() - startOffset);

    this.weeks = [];
    for (let w = 0; w < 6; w++) {
      const week: Date[] = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(start);
        day.setDate(start.getDate() + w * 7 + d);
        week.push(day);
      }
      this.weeks.push(week);
    }
  }

  buildWeek() {
    const monday = new Date(this.currentDate);
    const day = (monday.getDay() + 6) % 7;
    monday.setDate(monday.getDate() - day);
    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }

  hasWorkout(date: Date): boolean {
    return this.workoutDates.has(date.toISOString().split('T')[0]);
  }

  isToday(date: Date): boolean {
    return date.toISOString().split('T')[0] === this.today.toISOString().split('T')[0];
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate.getMonth();
  }

  navigate(direction: number) {
    const d = new Date(this.currentDate);
    if (this.view === 'month') {
      d.setMonth(d.getMonth() + direction);
    } else {
      d.setDate(d.getDate() + direction * 7);
    }
    this.currentDate = d;
    this.buildCalendar();
  }

  toggleView() {
    this.view = this.view === 'month' ? 'week' : 'month';
    this.buildCalendar();
  }

  getMonthLabel(): string {
    return this.currentDate.toLocaleDateString('fi-FI', { month: 'long', year: 'numeric' });
  }

  getWeekLabel(): string {
    const days = this.view === 'week' ? this.weekDays : [];
    if (!days.length) return '';
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return `${days[0].toLocaleDateString('fi-FI', opts)} – ${days[6].toLocaleDateString('fi-FI', opts)}`;
  }
}