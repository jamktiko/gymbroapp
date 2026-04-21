import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss'],
  imports: [IonButton],
})
export class SquareComponent implements OnInit {
  @Input() index!: number;
  @Input() value!: string;
  isDisabled!: boolean;

  @Output() squareClick = new EventEmitter<void>();

  onClick() {
    this.squareClick.emit();
  }

  constructor() {}

  ngOnInit() {
    // console.log(this.isDisabled);
    this.isDisabled = this.value ? true : false;
  }
}
