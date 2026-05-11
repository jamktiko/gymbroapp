/**
 * DataFetchService acts as a bridge between the application and backend.
 * Inject this service into a component to send authorized HTTP requests to the backend.
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {
  Move,
  TrainingProgram,
  TrainingSession,
  UserData,
} from './types/userdata';

@Injectable({
  providedIn: 'root',
})
export class DataFetchService {
  private api = 'http://localhost:3000/api';
  private http = inject(HttpClient);

  /**
   * Lukee googleId:n sessionStoragesta.
   * Palauttaa null jos ei löydy tai data on korruptoitunut.
   */
  private getGoogleId(): string | null {
    try {
      const data = JSON.parse(sessionStorage.getItem('accesstoken') || '{}');
      return data.googleId || null;
    } catch {
      return null;
    }
  }

  // ---------------------------- USER METHODS: ----------------------------

  /**
   * [GET] Fetches all user data by id from database.
   */
  getUserDataById(): Observable<UserData> {
    const id = this.getGoogleId();
    if (!id) return throwError(() => new Error('No access token found.'));
    return this.http.get<UserData>(`${this.api}/users/${id}`);
  }

  // ---------------------------- MOVE METHODS: ----------------------------

  /**
   * [GET] Fetches all default moves + user's custom created moves from database.
   */
  getAllMoves(): Observable<Move[]> {
    return this.http.get<Move[]>(`${this.api}/moves`);
  }

  /**
   * [POST] Creates a new move and adds it to the database.
   * createdBy lisätään automaattisesti googleId:stä.
   */
  createMove(moveData: Omit<Move, '_id' | 'isDefault' | 'createdBy'>): Observable<Move> {
    return this.http.post<Move>(`${this.api}/moves`, {
      ...moveData,
      createdBy: this.getGoogleId(),
    });
  }

  /**
   * [DELETE] Removes a move from database.
   */
  deleteMove(id: string): Observable<Move> {
    return this.http.delete<Move>(`${this.api}/moves/${id}`);
  }

  // ----------------------- TRAININGPROGRAM METHODS: -----------------------

  /**
   * [POST] Creates a new trainingprogram and adds it to the database.
   * _id lisätään automaattisesti MongoDB:ssä, isDefault oletusarvona false.
   */
  createProgram(programData: Omit<TrainingProgram, '_id' | 'isDefault' | '__v'>): Observable<TrainingProgram> {
    return this.http.post<TrainingProgram>(`${this.api}/training-programs`, programData);
  }

  /**
   * [DELETE] Deletes a trainingprogram.
   */
  deleteProgram(id: string): Observable<TrainingProgram> {
    return this.http.delete<TrainingProgram>(`${this.api}/training-programs/${id}`);
  }

  // ----------------------- TRAININGSESSION METHODS: -----------------------

  /**
   * [POST] Creates a new trainingsession and adds it to the database.
   */
  createSession(sessionData: Omit<TrainingSession, '_id' | 'createdAt' | 'updatedAt' | 'datetime'>): Observable<TrainingSession> {
    return this.http.post<TrainingSession>(`${this.api}/training-sessions`, sessionData);
  }

  // ----------------------- CALENDAR METHODS: -----------------------

  /**
   * [GET] Fetches dates of completed training sessions for calendar view.
   * Palauttaa listan päivämääriä muodossa ['2025-05-01', '2025-05-03', ...].
   */
  getCalendarDates(): Observable<string[]> {
    const id = this.getGoogleId();
    if (!id) return throwError(() => new Error('No access token found.'));
    return this.http.get<string[]>(`${this.api}/users/${id}/calendar`);
  }
}