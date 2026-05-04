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

  // private sessionData = null;

  // GET
  // POST
  // PATCH
  // DELETE

  fetchJWTToken() {
    // try {
    //   const sessionDataString = sessionStorage.getItem('accesstoken');
    //   if (sessionDataString) {
    //     const sessionData = JSON.parse(sessionDataString);
    //     // const url = `http://localhost:3000/api/users/${sessionData.googleId}`;
    //   }
    // } catch (error) {
    //   console.error(
    //     'Error while fetching JTW token from sessionStorage:',
    //     error,
    //   );
    // }
  }

  // fetches all user data from database
  getUserDataById(id: string): Observable<UserData> {
    try {
      const sessionDataString = sessionStorage.getItem('accesstoken');
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);

        return this.http.get<UserData>(`${this.apiurlUsers}/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionData.token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error(
        'Error while fetching JTW token from sessionStorage:',
        error,
      );
    }
    return throwError(() => new Error('Unable to fetch user data.'));
  }
}
