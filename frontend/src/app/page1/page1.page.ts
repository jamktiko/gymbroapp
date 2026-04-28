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
} from '@abacritt/angularx-social-login';
import { AuthService } from '../auth.service';

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
  ],
})
export class Page1Page implements OnInit {
  private socauthService = inject(SocialAuthService);
  private authService = inject(AuthService);

  constructor(private router: Router) {
    addIcons({ logoGoogle, logInOutline });
  }

  ngOnInit() {
    this.socauthService.authState.subscribe((user) => {
      if (user) {
        console.log('Successfully logged in via Google button', user);
        this.router.navigateByUrl('/page2', { replaceUrl: true });
      }
    });
  }
}
