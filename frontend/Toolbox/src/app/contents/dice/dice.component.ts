import {Component} from '@angular/core';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss']
})
export class DiceComponent {

  diceAmount: number = 1;
  dice: number[] = new Array(this.diceAmount).fill(0);
  diceResults: { value: number, amount: number }[] = [];
  diceRotations: { x: number, y: number }[] = new Array(this.diceAmount).fill({x: 0, y: 0});
  maxRotations: number = 10;
  minRotations: number = 5;
  isOddRoll: boolean = false;
  isRolling: boolean = false;

  rollDice() {
    this.isOddRoll = !this.isOddRoll;
    let diceElements: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("dice__dice") as HTMLCollectionOf<HTMLElement>;
    let xRotation: number;
    let yRotation: number;

    for (let i = 0; i < diceElements.length; i++) {
      let diceElement: HTMLElement | null = diceElements.item(i);
      if (diceElement) {
        if (this.isOddRoll) {
          xRotation = Math.floor(Math.random() * (this.maxRotations - this.minRotations + 1) + this.minRotations) * 90;
          yRotation = Math.floor(Math.random() * (this.maxRotations - this.minRotations + 1) + this.minRotations) * 90;
        } else {
          xRotation = -Math.floor(Math.random() * (this.maxRotations - this.minRotations + 1) + this.minRotations) * 90;
          yRotation = -Math.floor(Math.random() * (this.maxRotations - this.minRotations + 1) + this.minRotations) * 90;
        }

        diceElement.style.transform = "rotateY(" + (yRotation - 10) + "deg) rotateX(" + (xRotation - 10) + "deg)";
        this.diceRotations[i] = {x: xRotation, y: yRotation};
      }
    }
  }

  getResult() {
    this.diceResults = []
    const xSitesOdd: number[] = [1, 4, 6, 3];
    const xSitesEven: number[] = [1, 3, 6, 4];

    const ySitesOdd1: number[] = [1, 5, 6, 2];
    const ySitesOdd4: number[] = [4, 5, 3, 2];
    const ySitesOdd6: number[] = [6, 5, 1, 2];
    const ySitesOdd3: number[] = [3, 5, 4, 2];

    const ySitesEven1: number[] = [1, 2, 6, 5];
    const ySitesEven4: number[] = [4, 2, 3, 5];
    const ySitesEven6: number[] = [6, 2, 1, 5];
    const ySitesEven3: number[] = [3, 2, 4, 5];

    for (let i = 0; i < this.diceRotations.length; i++) {
      let x: number;
      let result: number = 0;
      let xIndex: number = this.diceRotations[i].x / 90 % 4;
      let yIndex: number = this.diceRotations[i].y / 90 % 4;

      if (this.isOddRoll) {
        x = xSitesOdd[xIndex];
        switch (x) {
          case 1:
            result = ySitesOdd1[yIndex];
            break;
          case 4:
            result = ySitesOdd4[yIndex];
            break;
          case 6:
            result = ySitesOdd6[yIndex];
            break;
          case 3:
            result = ySitesOdd3[yIndex];
            break;
        }
      } else {
        x = xSitesEven[xIndex * -1];
        switch (x) {
          case 1:
            result = ySitesEven1[yIndex * -1];
            break;
          case 4:
            result = ySitesEven4[yIndex * -1];
            break;
          case 6:
            result = ySitesEven6[yIndex * -1];
            break;
          case 3:
            result = ySitesEven3[yIndex * -1];
            break;
        }
      }
      this.updateResults(result);
    }
    this.sortResults();
  }

  updateResults(result: number) {
    if (this.diceResults.length == 0) {
      this.diceResults.push({value: result, amount: 1});
    } else {
      for (let i: number = 0; i < this.diceResults.length; i++) {
        if (this.diceResults[i].value == result) {
          this.diceResults[i].amount++;
          return;
        } else if (i == this.diceResults.length - 1) {
          this.diceResults.push({amount: 1, value: result});
          return;
        }
      }
    }
  }

  sortResults() {
    this.diceResults.sort((a, b) => a.value - b.value)
  }

  addDice() {
    if (this.diceAmount < 100) {
      this.diceAmount++;
      this.dice.push(0);
      this.diceRotations.push({x: 0, y: 0})
      this.getResult()
    }
  }

  removeDice() {
    if (this.diceAmount > 1) {
      this.diceAmount--;
      this.dice.splice(this.dice.length - 1, 1);
      this.diceRotations.splice(this.diceRotations.length - 1, 1);
      this.getResult()
    }
  }
}
