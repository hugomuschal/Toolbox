import {Component} from '@angular/core';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss']
})
export class DiceComponent {

  diceAmount: number = 1;
  dice: number[] = new Array(this.diceAmount).fill(0);
  sortedDiceResults: { value: number, amount: number }[] = new Array(1).fill({value: 1, amount: this.diceAmount});
  unsortedDiceResults: number[] = new Array(this.diceAmount).fill(1);
  maxRotations: number = 2;
  minRotations: number = 1;
  isOddRoll: boolean = false;
  isRolling: boolean = false;

  rollDice() {
    this.isOddRoll = !this.isOddRoll;
    this.sortedDiceResults = [];
    let diceElements: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("dice__dice") as HTMLCollectionOf<HTMLElement>;
    let xRotation: number;
    let yRotation: number;

    for (let i = 0; i < diceElements.length; i++) {
      let diceElement: HTMLElement | null = diceElements.item(i);
      let result = Math.floor(Math.random() * (6 - 1 + 1) + 1)
      if (diceElement) {
        if (this.isOddRoll) {
          xRotation = Math.floor(Math.random() * (this.maxRotations - this.minRotations + 1) + this.minRotations) * 360;
          yRotation = Math.floor(Math.random() * (this.maxRotations - this.minRotations + 1) + this.minRotations) * 360;
        } else {
          xRotation = -Math.floor(Math.random() * (this.maxRotations - this.minRotations + 1) + this.minRotations) * 360;
          yRotation = -Math.floor(Math.random() * (this.maxRotations - this.minRotations + 1) + this.minRotations) * 360;
        }

        switch (result) {
          case 1:
            diceElement.style.transform = "rotateY(" + (360 + yRotation - 10) + "deg) rotateX(" + (360 + xRotation - 10) + "deg)";
            this.updateResults(1)
            this.unsortedDiceResults[i] = 1;
            break;
          case 2:
            diceElement.style.transform = "rotateY(" + (270 + yRotation - 10) + "deg) rotateX(" + (360 + xRotation - 10) + "deg)";
            this.updateResults(2)
            this.unsortedDiceResults[i] = 2;
            break;
          case 3:
            diceElement.style.transform = "rotateY(" + (180 + yRotation - 10) + "deg) rotateX(" + (90 + xRotation - 10) + "deg)";
            this.updateResults(3)
            this.unsortedDiceResults[i] = 3;
            break;
          case 4:
            diceElement.style.transform = "rotateY(" + (360 + yRotation - 10) + "deg) rotateX(" + (90 + xRotation - 10) + "deg)";
            this.updateResults(4)
            this.unsortedDiceResults[i] = 4;
            break;
          case 5:
            diceElement.style.transform = "rotateY(" + (90 + yRotation - 10) + "deg) rotateX(" + (360 + xRotation - 10) + "deg)";
            this.updateResults(5)
            this.unsortedDiceResults[i] = 5;
            break;
          case 6:
            diceElement.style.transform = "rotateY(" + (180 + yRotation - 10) + "deg) rotateX(" + (360 + xRotation - 10) + "deg)";
            this.updateResults(6)
            this.unsortedDiceResults[i] = 6;
            break;
        }
      }
    }
  }


  updateResults(result: number) {
    if (this.sortedDiceResults.length == 0) {
      this.sortedDiceResults.push({value: result, amount: 1});
    } else {
      for (let i: number = 0; i < this.sortedDiceResults.length; i++) {
        if (this.sortedDiceResults[i].value == result) {
          this.sortedDiceResults[i].amount++;
          return;
        }else if (this.sortedDiceResults[i].value == result * - 1){
          this.sortedDiceResults[i].amount--;
          return;
        } else if (i == this.sortedDiceResults.length - 1) {
          this.sortedDiceResults.push({amount: 1, value: result});
          return;
        }
      }
    }
  }

  sortResults() {
    this.sortedDiceResults.sort((a, b) => a.value - b.value)
  }

  addDice() {
    if (this.diceAmount < 100) {
      this.diceAmount++;
      this.dice.push(0);
      this.updateResults(1)
      this.unsortedDiceResults.push(1)
    }
  }

  removeDice() {
    if (this.diceAmount > 1) {
      this.diceAmount--;
      this.dice.splice(this.dice.length - 1, 1);
      this.updateResults(-this.unsortedDiceResults[this.unsortedDiceResults.length - 1])
      this.unsortedDiceResults.splice(this.unsortedDiceResults.length - 1, 1);
    }
  }
}
