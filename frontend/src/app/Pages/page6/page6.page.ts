import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { XpService } from '../../xp.service';
import { MenuController } from '@ionic/angular/standalone';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonProgressBar,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-page6',
  templateUrl: './page6.page.html',
  styleUrls: ['./page6.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonFooter,
    IonButton,
    IonProgressBar,
  ],
})
export class Page6Page implements OnInit {
  private menu = inject(MenuController);
  constructor(
    public xpService: XpService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.xpService.testaaProgress();
  }
  ionViewWillEnter() {
    this.menu.enable(false); //menu disabled
  }
  ionViewWillLeave() {
    this.menu.enable(true); //varmistaa että menu seuraavassa
  }
  aloitussivulle() {
    this.router.navigate(['/page2']);
  }
}
