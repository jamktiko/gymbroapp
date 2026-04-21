import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonCol,
  IonRow,
  IonGrid,
  ModalController,
  AlertController,
  IonFooter,
  IonSpinner,
} from '@ionic/angular/standalone';

// modal to be opened within this game screen
import { GameScreenModalComponent } from '../game-screen-modal/game-screen-modal.component';
import { SquareComponent } from '../square/square.component';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.page.html',
  styleUrls: ['./game-screen.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonMenuButton,
    IonCol,
    IonRow,
    IonGrid,
    SquareComponent,
    IonFooter,
    IonSpinner,
  ],
})
export class GameScreenPage implements OnInit {
  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);
  // all 81 squares of the sudoku board and their values are located here
  squares!: string[];

  ngOnInit() {
    this.fillSquaresWithEmpty();
    // this.fillSquaresWithIndexes();
    this.populateWithAnEasyLevel();
    // this.winConDebugginMethod();
  }

  constructor() {}

  // method for opening modal window when player wants to make a move
  // note that modal stylings are found in global.scss
  async openModal(index: number, value: string) {
    const modal = await this.modalCtrl.create({
      component: GameScreenModalComponent,
      componentProps: {
        iocs: index,
        vocs: value,
      },
      cssClass: 'small-custom-modal',
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    this.updateASquare(data.index, data.value);

    await modal.onDidDismiss();

    if (this.winConCheck()) {
      this.presentWinnerAlert();
    }
  }

  // shows alert if player has won
  async presentWinnerAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Congratulations! You have solved the puzzle!',
      message: '',
      buttons: ['Ok'],
    });

    // const temp = await this.modalCtrl.getTop();
    // console.log(temp?.checkVisibility());
    // if (temp?.checkVisibility())
    // if (temp?.checkVisibility) {
    // }
    // setTimeout(async () => {
    //   await alert.present();
    // }, 500);
    await alert.present();
  }

  // fills all squares with ''
  fillSquaresWithEmpty() {
    // setTimeout(() => {
    //   this.squares = Array(81).fill('');
    // }, 500);
    this.squares = Array(81).fill('');
  }

  // fills all squares with numbers 0-80
  fillSquaresWithIndexes() {
    for (let i = 0; i < 81; i++) {
      this.squares[i] = `${i + 1}`;
    }
  }

  // populate squares with an easy level copied from a sudoku book
  populateWithAnEasyLevel() {
    this.squares[0] = '5';
    this.squares[1] = '8';
    this.squares[2] = '';
    this.squares[3] = '4';
    this.squares[4] = '';
    this.squares[5] = '1';
    this.squares[6] = '7';
    this.squares[7] = '2';
    this.squares[8] = '';

    this.squares[9] = '9';
    this.squares[10] = '';
    this.squares[11] = '';
    this.squares[12] = '';
    this.squares[13] = '';
    this.squares[14] = '7';
    this.squares[15] = '6';
    this.squares[16] = '5';
    this.squares[17] = '8';

    this.squares[18] = '';
    this.squares[19] = '';
    this.squares[20] = '3';
    this.squares[21] = '8';
    this.squares[22] = '';
    this.squares[23] = '';
    this.squares[24] = '';
    this.squares[25] = '1';
    this.squares[26] = '';

    this.squares[27] = '6';
    this.squares[28] = '3';
    this.squares[29] = '';
    this.squares[30] = '5';
    this.squares[31] = '';
    this.squares[32] = '';
    this.squares[33] = '4';
    this.squares[34] = '';
    this.squares[35] = '';

    this.squares[36] = '8';
    this.squares[37] = '';
    this.squares[38] = '9';
    this.squares[39] = '';
    this.squares[40] = '';
    this.squares[41] = '4';
    this.squares[42] = '2';
    this.squares[43] = '';
    this.squares[44] = '1';

    this.squares[45] = '';
    this.squares[46] = '';
    this.squares[47] = '';
    this.squares[48] = '6';
    this.squares[49] = '';
    this.squares[50] = '9';
    this.squares[51] = '';
    this.squares[52] = '3';
    this.squares[53] = '';

    this.squares[54] = '';
    this.squares[55] = '';
    this.squares[56] = '1';
    this.squares[57] = '7';
    this.squares[58] = '';
    this.squares[59] = '5';
    this.squares[60] = '';
    this.squares[61] = '9';
    this.squares[62] = '';

    this.squares[63] = '';
    this.squares[64] = '2';
    this.squares[65] = '5';
    this.squares[66] = '';
    this.squares[67] = '';
    this.squares[68] = '3';
    this.squares[69] = '1';
    this.squares[70] = '';
    this.squares[71] = '6';

    this.squares[72] = '';
    this.squares[73] = '';
    this.squares[74] = '8';
    this.squares[75] = '';
    this.squares[76] = '6';
    this.squares[77] = '';
    this.squares[78] = '5';
    this.squares[79] = '';
    this.squares[80] = '';
  }

  // updates value of a square the player clicked with the value their chose in modal window
  updateASquare(index: number, value: string) {
    this.squares[index] = value;
  }

  // checks if player has won
  // returns true or false
  winConCheck(): boolean {
    // 1. lets check horizontal lines first
    for (let row = 0; row < 9; row++) {
      const rowValues = [];
      for (let col = 0; col < 9; col++) {
        // row * 9 because if we want to move on to the next row we have to go forward by 9 indexes
        rowValues.push(this.squares[row * 9 + col]);
      }

      // checks if the row contains all numbers from '1' to '9'
      for (let number = 1; number <= 9; number++) {
        if (!rowValues.includes(number.toString())) {
          // if it wasnt included, we didnt win
          // just exit the function right here in that case
          return false;
        }
      }
    }

    console.log('All horizontal lines are correct!');

    // 2. after that lets check individual inner squares
    for (let bigRow = 0; bigRow < 3; bigRow++) {
      for (let bigCol = 0; bigCol < 3; bigCol++) {
        const sqValues = [];

        // collect the 9 values for the current 3x3 square
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            // bigRow * 3 because when we move on to the next small square we move forward by 3 indexes
            const rowIndex = bigRow * 3 + row;
            const colIndex = bigCol * 3 + col;
            // row * 9 because if we want to move on to the next row we have to go forward by 9 indexes
            sqValues.push(this.squares[rowIndex * 9 + colIndex]);
          }
        }

        // lets check if the 3x3 square contains all numbers from '1' to '9'
        for (let number = 1; number <= 9; number++) {
          if (!sqValues.includes(number.toString())) {
            return false;
          }
        }
      }
    }

    console.log('All inner squares are correct!');

    return true;
  }

  // temporary function for wincon debugging
  winConDebugginMethod() {
    this.squares[0] = '1';
    this.squares[1] = '2';
    this.squares[2] = '3';
    this.squares[3] = '4';
    this.squares[4] = '5';
    this.squares[5] = '6';
    this.squares[6] = '7';
    this.squares[7] = '8';
    this.squares[8] = '9';

    this.squares[9] = '4';
    this.squares[10] = '5';
    this.squares[11] = '6';
    this.squares[12] = '7';
    this.squares[13] = '8';
    this.squares[14] = '9';
    this.squares[15] = '1';
    this.squares[16] = '2';
    this.squares[17] = '3';

    this.squares[18] = '7';
    this.squares[19] = '8';
    this.squares[20] = '9';
    this.squares[21] = '1';
    this.squares[22] = '2';
    this.squares[23] = '3';
    this.squares[24] = '4';
    this.squares[25] = '5';
    this.squares[26] = '6';

    this.squares[27] = '2';
    this.squares[28] = '3';
    this.squares[29] = '4';
    this.squares[30] = '5';
    this.squares[31] = '6';
    this.squares[32] = '7';
    this.squares[33] = '8';
    this.squares[34] = '9';
    this.squares[35] = '1';

    this.squares[36] = '5';
    this.squares[37] = '6';
    this.squares[38] = '7';
    this.squares[39] = '8';
    this.squares[40] = '9';
    this.squares[41] = '1';
    this.squares[42] = '2';
    this.squares[43] = '3';
    this.squares[44] = '4';

    this.squares[45] = '8';
    this.squares[46] = '9';
    this.squares[47] = '1';
    this.squares[48] = '2';
    this.squares[49] = '3';
    this.squares[50] = '4';
    this.squares[51] = '5';
    this.squares[52] = '6';
    this.squares[53] = '7';

    this.squares[54] = '3';
    this.squares[55] = '4';
    this.squares[56] = '5';
    this.squares[57] = '6';
    this.squares[58] = '7';
    this.squares[59] = '8';
    this.squares[60] = '9';
    this.squares[61] = '1';
    this.squares[62] = '2';

    this.squares[63] = '6';
    this.squares[64] = '7';
    this.squares[65] = '8';
    this.squares[66] = '9';
    this.squares[67] = '1';
    this.squares[68] = '2';
    this.squares[69] = '3';
    this.squares[70] = '4';
    this.squares[71] = '5';

    this.squares[72] = '9';
    this.squares[73] = '1';
    this.squares[74] = '2';
    this.squares[75] = '3';
    this.squares[76] = '4';
    this.squares[77] = '5';
    this.squares[78] = '6';
    this.squares[79] = '7';
    this.squares[80] = '';
  }
}
