/**
 * DataFetchService acts as a bridge between the application and backend
 * By injecting this service into a component you can send authorized http requests to backend
 * Backend will then take these requests in and invoke REST API methods accordingly
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
  private apiurlMoves = 'https://dzw1f1bfpf15d.cloudfront.net/api/moves';
  private apiurlUsers = 'https://dzw1f1bfpf15d.cloudfront.net/api/users';
  private apiurlPrograms =
    'https://dzw1f1bfpf15d.cloudfront.net/api/training-programs';
  private apiurlSessions =
    'https://dzw1f1bfpf15d.cloudfront.net/api/training-sessions';

  private http = inject(HttpClient);

  // GET
  // POST
  // PATCH
  // DELETE

  // ---------------------------- USER METHODS: ----------------------------

  /**
   * [GET] Fetches all user data by id from database.
   */
  getUserDataById(): Observable<UserData> {
    // fetch JWT token from sessionStorage
    let sessionData;

    try {
      const sessionDataString = sessionStorage.getItem('accesstoken');
      if (!sessionDataString) {
        return throwError(() => new Error('No access token found in session.'));
      }
      sessionData = JSON.parse(sessionDataString);
    } catch (error) {
      console.error('Error parsing session data:', error);
      return throwError(() => new Error('Invalid or corrupted session data.'));
    }

    // actual http request
    return this.http.get<UserData>(
      `${this.apiurlUsers}/${sessionData.googleId}`,
    );
  }

  /**
   * [PATCH] Modifies currently logged in user's data.
   * - right now not sure if this method is needed at all
   */
  updateUserDataById() {
    //
  }

  // ---------------------------- MOVE METHODS: ----------------------------

  /**
   * [GET] Fetches all default moves + user's custom created moves from database.
   */
  getAllMoves(): Observable<Move[]> {
    return this.http.get<Move[]>(this.apiurlMoves);
  }

  /**
   * [GET] Fetches a move by id from database.
   */
  getMoveById() {
    //
  }

  /**
   * [POST] Creates a new move and adds it to the database.
   */
  createMove(
    moveData: Omit<Move, '_id' | 'isDefault' | 'createdBy'>,
  ): Observable<Move> {
    let googleId = null;
    try {
      const sessionDataString = sessionStorage.getItem('accesstoken');
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);
        googleId = sessionData.googleId;
      }
    } catch (error) {
      console.error('Error parsing session data for googleId:', error);
    }

    // actual http request
    const moveData2 = {
      ...moveData,
      createdBy: googleId,
    };

    return this.http.post<Move>(this.apiurlMoves, moveData2);
  }

  /**
   * [DELETE] Removes a move from database.
   */
  deleteMove(id: string): Observable<Move> {
    return this.http.delete<Move>(`${this.apiurlMoves}/${id}`);
  }

  // ----------------------- TRAININGPROGRAM METHODS: -----------------------

  /**
   * [GET] Fetches all trainingprograms for currently logged in user.
   */
  getAllPrograms() {
    //
  }

  /**
   * [GET] Fetches a trainingprogram by id for currently logged in user.
   * - this method is used when starting a new trainingsession
   */
  getProgramById() {
    //
  }

  /**
   * [POST] Creates a new trainingprogram document and adds it to the database.
   * - we dont need to add _id because it is added automatically by mongodb
   * - isDefault can be omitted because it has a default value of false
   * - __v is just for mongo's internal logs
   */
  createProgram(
    programData: Omit<TrainingProgram, '_id' | 'isDefault' | '__v'>,
  ): Observable<TrainingProgram> {
    return this.http.post<TrainingProgram>(this.apiurlPrograms, programData);
  }

  /**
   * [DELETE] Deletes a trainingprogram.
   */
  deleteProgram(id: string): Observable<TrainingProgram> {
    return this.http.delete<TrainingProgram>(`${this.apiurlPrograms}/${id}`);
  }

  /**
   * [PATCH] Updates an existing trainingprogram.
   */
  updateProgram(
    id: string,
    programData: Omit<TrainingProgram, '_id' | '__v'>,
  ): Observable<TrainingProgram> {
    return this.http.patch<TrainingProgram>(
      `${this.apiurlPrograms}/${id}`,
      programData,
    );
  }

  // ----------------------- TRAININGSESSION METHODS: -----------------------

  /**
   * [GET] Fetches all trainingsession for currently logged in user.
   */
  getAllSessions(): Observable<TrainingSession[]> {
    return this.http.get<TrainingSession[]>(this.apiurlSessions);
  }

  /**
   * [GET] Fetches a trainingsession by id for currently logged in user.
   * - this method is used if we implement a calendar view at some point
   * - ex. if user clicks on a specific date you could see more info about the session
   */
  getSessionById() {
    //
  }

  /**
   * [POST] Creates a new trainingsession and adds it to the database.
   */
  createSession(
    sessionData: Omit<
      TrainingSession,
      '_id' | 'createdAt' | 'updatedAt' | 'datetime'
    >,
  ): Observable<TrainingSession> {
    return this.http.post<TrainingSession>(this.apiurlSessions, sessionData);
  }
  // ----------------------- STATS METHODS: -----------------------

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getStats(): Observable<any> {
    let googleId = null;
    try {
      const sessionDataString = sessionStorage.getItem('accesstoken');
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);
        googleId = sessionData.googleId;
      }
    } catch (error) {
      console.error('Error parsing session data for googleId:', error);
    }
    if (!googleId) return throwError(() => new Error('No access token found.'));
    return this.http.get(`${this.apiurlUsers}/${googleId}/stats`);
  }

  // ----------------------- CALENDAR METHODS: -----------------------

  /**
   * [GET] Fetches dates of completed training sessions for calendar view.
   * Palauttaa listan päivämääriä muodossa ['2025-05-01', '2025-05-03', ...].
   */
  getCalendarDates(): Observable<string[]> {
    let googleId = null;
    try {
      const sessionDataString = sessionStorage.getItem('accesstoken');
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);
        googleId = sessionData.googleId;
      }
    } catch (error) {
      console.error('Error parsing session data for googleId:', error);
    }
    return this.http.get<string[]>(`${this.apiurlUsers}/${googleId}/calendar`);
  }
}
