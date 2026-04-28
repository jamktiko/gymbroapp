import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private googleLoginUrl = 'http://localhost:3000/api/auth/google';
  public token: string;
  private jwtHelp = new JwtHelperService();
  private http = inject(HttpClient);

  constructor() {
    const currentUser = JSON.parse(
      sessionStorage.getItem('accesstoken') || '{}',
    );
    this.token = currentUser || currentUser.token;
  }

  glogin(gtoken: string, userid: string): Observable<boolean> {
    console.log('hep');
    return this.http.post(this.googleLoginUrl, { gtoken: gtoken }).pipe(
      map((res: { token?: string }) => {
        console.log(res); // loggaa alla olevan tyylisen vastauksen
        /*
        {success: true, message:
          "Tässä on valmis JWT-Token!",
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ…zNzV9.x1gWEg9DtoPtEUUHlR8aDgpuzG6NBNJpa2L-MEhyraQ"}
        */
        const token = res.token; // otetaan vastauksesta token
        if (token) {
          this.token = token;
          /* Tässä tutkitaan onko tokenin payloadin sisältö oikea.
            Jos on, laitetaan token sessionStorageen ja palautetaan true
            jolloin käyttäjä pääsee Admin-sivulle
         */
          try {
            // dekoodataan token
            const payload = this.jwtHelp.decodeToken(token);
            console.log(payload);
            // Tässä voidaan tarkistaa tokenin oikeellisuus
            if (payload.username === userid && payload.isadmin === true) {
              // token sessionStorageen
              sessionStorage.setItem(
                'accesstoken',
                JSON.stringify({ userid: userid, token: token }),
              );
              // this.loginTrue(); // lähetetään viesti navbariin että vaihdetaan login:true -tilaan
              console.log('login onnistui');
              return true; // saatiin token
            } else {
              console.log('login epäonnistui');
              return false; // ei saatu tokenia
            }
          } catch {
            return false;
          }
        } else {
          console.log('tokenia ei ole');
          return false;
        }
      }),
    );
  }

  // logout poistaa tokenin sessionStoragesta
  logout(): void {
    this.token = '';
    sessionStorage.removeItem('accesstoken');
  }
}
