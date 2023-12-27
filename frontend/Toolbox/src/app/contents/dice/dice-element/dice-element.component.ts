import { Component } from '@angular/core';
import {DiceComponent} from "../dice.component";

@Component({
  selector: 'app-dice-element',
  templateUrl: './dice-element.component.html',
  styleUrls: ['./dice-element.component.scss']
})
export class DiceElementComponent {

  constructor(public dice: DiceComponent) {
  }
}
