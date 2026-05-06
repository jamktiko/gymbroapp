// DataFetchService acts as a bridge between the application and backend
// By injecting this service into a component you can send authorized http requests to backend
// Backend will then take these requests in and invoke REST API methods accordingly

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Move, TrainingProgram, UserData } from './types/userdata';

@Injectable({
  providedIn: 'root',
})
export class DataFetchService {
  private apiurlMoves = 'http://localhost:3000/api/moves';
  private apiurlUsers = 'http://localhost:3000/api/users';
  private apiurlPrograms = 'http://localhost:3000/api/training-programs';
  private apiurlSessions = 'http://localhost:3000/api/training-sessions';

  private http = inject(HttpClient);

  // private sessionStorageToken;

  // private sessionData = null;

  // GET
  // POST
  // PATCH
  // DELETE

  // fetchJWTToken() {
  //   // try {
  //   //   const sessionDataString = sessionStorage.getItem('accesstoken');
  //   //   if (sessionDataString) {
  //   //     const sessionData = JSON.parse(sessionDataString);
  //   //     // const url = `http://localhost:3000/api/users/${sessionData.googleId}`;
  //   //   }
  //   // } catch (error) {
  //   //   console.error(
  //   //     'Error while fetching JTW token from sessionStorage:',
  //   //     error,
  //   //   );
  //   // }
  // }

  //
  //
  //
  //

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
    // fetch JWT token from sessionStorage
    // let sessionData;

    // try {
    //   const sessionDataString = sessionStorage.getItem('accesstoken');
    //   if (!sessionDataString) {
    //     return throwError(() => new Error('No access token found in session.'));
    //   }
    //   sessionData = JSON.parse(sessionDataString);
    // } catch (error) {
    //   console.error('Error parsing session data:', error);
    //   return throwError(() => new Error('Invalid or corrupted session data.'));
    // }

    // return this.http.get<Move[]>(this.apiurlMoves, {
    //   headers: {
    //     'googleId': sessionData.googleId
    //   }
    // });

    // actual http request
    const test = this.http.get<Move[]>(this.apiurlMoves);
    console.log(`test: ${test}`);
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
  ) {
    return this.http.post<TrainingProgram>(this.apiurlPrograms, programData);
  }

  /**
   * [DELETE] Deletes a trainingprogram.
   */
  deleteProgram(id: string): Observable<TrainingProgram> {
    return this.http.delete<TrainingProgram>(`${this.apiurlPrograms}/${id}`);
  }

  // ----------------------- TRAININGSESSION METHODS: -----------------------

  /**
   * [GET] Fetches all trainingsession for currently logged in user.
   */
  getAllSession() {
    //
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
  createSession() {
    //
  }
}
