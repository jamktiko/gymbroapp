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

  glogin(googleIdToken: string, googleId: string): Observable<boolean> {
    // console.log(googleId);
    // console.log(googleIdToken);
    return this.http.post(this.googleLoginUrl, { gtoken: googleIdToken }).pipe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map((res: any) => {
        const token = res['token']; // otetaan vastauksesta token
        if (token) {
          this.token = token;
          try {
            // dekoodataan token
            const decodedToken = this.jwtHelp.decodeToken(token);
            console.log(`decodedToken: ${decodedToken}`);
            console.log(JSON.stringify(decodedToken));
            // Tässä voidaan tarkistaa tokenin oikeellisuus
            if (googleId === decodedToken.googleId) {
              // token sessionStorageen
              sessionStorage.setItem(
                'accesstoken',
                JSON.stringify({ googleId: googleId, token: token }),
              );

              console.log('test1');
              console.log(token);
              console.log(this.jwtHelp.decodeToken(token));
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
