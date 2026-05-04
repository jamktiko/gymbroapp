// DataFetchService acts as a bridge between the application and backend
// By injecting this service into a component you can send authorized http requests to backend
// Backend will then take these requests in and invoke REST API methods accordingly

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UserData } from './types/userdata';

@Injectable({
  providedIn: 'root',
})
export class DataFetchService {
  private apiurlMoves = 'http://localhost:3000/api/moves';
  private apiurlUsers = 'http://localhost:3000/api/users';
  private apiurlPrograms = 'http://localhost:3000/api/trainingPrograms';
  private apiurlSessions = 'http://localhost:3000/api/trainingSessions';

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

  // [GET] fetches all user data by id from database
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

  // [PATCH] modifies currently logged in user's data
  updateUserDataById() {
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
    return this.http.patch<UserData>(
      `${this.apiurlUsers}/${sessionData.googleId}`,
      {}, // Provide payload data instead of headers here
    );
  }
}
