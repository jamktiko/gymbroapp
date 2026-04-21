import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  IonButton,
  ModalController,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-game-screen-modal',
  templateUrl: 'game-screen-modal.component.html',
  imports: [FormsModule, IonButton, IonGrid, IonRow, IonCol, IonIcon],
})
export class GameScreenModalComponent {
  @Input() iocs!: number;
  @Input() vocs!: string;
  private modalCtrl = inject(ModalController);

  constructor() {}

  confirm(choice: number | null) {
    return this.modalCtrl.dismiss({
      index: this.iocs,
      value: choice ? choice.toString() : '',
    });
  }
}
