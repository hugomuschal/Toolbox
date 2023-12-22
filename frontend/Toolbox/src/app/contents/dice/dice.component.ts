import { Component } from '@angular/core';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss']
})
export class DiceComponent {

  diceAmount: number = 1;
  dice: number[] = Array(this.diceAmount).fill(0);
  maxRotations: number = 10;
  minRotations: number = 5;
  oddRoll: boolean = false;

  rollDice(){
    let dice = document.getElementsByClassName("dice__dice") as HTMLCollectionOf<HTMLElement>;
    let xRotation;
    let yRotation

    for (let i = 0; i < dice.length; i++){
      let diceElement = dice.item(i);
      if (diceElement){
        if (this.oddRoll){
          xRotation = Math.floor(Math.random() * (this.maxRotations - this.minRotations + 1) + this.minRotations) * 90;
          yRotation = Math.floor(Math.random() * (this.maxRotations - this.minRotations + 1) + this.minRotations) * 90;
        }else{
          xRotation = - Math.floor(Math.random() * (this.maxRotations - this.minRotations + 1) + this.minRotations) * 90;
          yRotation = - Math.floor(Math.random() * (this.maxRotations - this.minRotations + 1) + this.minRotations) * 90;
        }

        diceElement.style.transform = "rotateY(" + (yRotation - 10) + "deg) rotateX(" + (xRotation - 10) + "deg)"
      }
    }

    this.oddRoll = !this.oddRoll;
  }

  addDice(){
    if (this.diceAmount < 100){
      this.diceAmount++
      this.dice = Array(this.diceAmount).fill(0);
    }
  }

  removeDice(){
    if (this.diceAmount > 1){
      this.diceAmount--
      this.dice = Array(this.diceAmount).fill(0);
    }
  }
}
