import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { logoGoogle, logInOutline } from 'ionicons/icons';
import {
  SocialAuthService,
  GoogleSigninButtonModule,
  SocialUser,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-page1',
  templateUrl: './page1.page.html',
  styleUrls: ['./page1.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    GoogleSigninButtonModule,
    SocialLoginModule,
  ],
})
export class Page1Page implements OnInit {
  private socauthService = inject(SocialAuthService);
  private authService = inject(AuthService);
  user!: SocialUser;
  error = '';

  constructor(private router: Router) {
    addIcons({ logoGoogle, logInOutline });
  }

  ngOnInit() {
    this.socauthService.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        console.log('Successfully logged in via Google button', user);

        /* Lähetetään glogin-metodilla Googlen idToken backendiin josta saadaan JWT
         Myös userin id annetaan authServicelle, jotta sitä voidaan verrata siellä
         backendistä saatuun userin id:hen. 
        */

        if (this.user != null) {
          this.authService
            .glogin(this.user.idToken!, this.user.id!)
            .subscribe((result) => {
              if (result === true) {
                // this.router.navigate(['/secret']);
              } else {
                this.error = 'Tunnus tai salasana väärä';
              }
            });
        }

        this.router.navigateByUrl('/page2', { replaceUrl: true });
        // liitä glogin tähän
      }
    });
  }
}
