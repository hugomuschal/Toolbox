import {AfterViewInit, Component} from '@angular/core';

@Component({
  selector: 'app-wheel',
  templateUrl: './wheel.component.html',
  styleUrls: ['./wheel.component.scss']
})
export class WheelComponent implements AfterViewInit {

  //polygonValues for 4-50 elements in wheel
  polygonValues: number[] = [
    0, 0, 0, 101, 85, 75, 66, 60, 54, 50, 46, 43, 40, 38, 36, 34, 32, 31, 29, 28, 27, 26, 25, 24, 23, 22.5,
    22, 20.8, 20, 19.5, 19, 18.5, 18, 17.5, 17, 16.5, 16, 15.6, 15.2, 14.8, 14.5, 14.2, 13.9, 13.6, 13.3,
    13, 12.8, 12.6, 12.4, 12.2
  ];
  //wheelElements: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"]
  wheelElements: string[] = ["Florian", "Hugo", "Christoffer", "Justin", "Kai-Uwe", "Ingo"]
  result: string = "";
  isOddSpin: boolean = true;    //to make rotate angle +/-
  isSpinning: boolean = false
  lastWheelElement: Element | undefined;

  ngAfterViewInit(): void {
    this.buildWheel();
  }

  buildWheel() {
    let wheelElements = document.getElementsByClassName("wheel__element") as HTMLCollectionOf<HTMLElement>;

    for (let i = 0; i < wheelElements.length; i++) {
      let wheelElement = wheelElements.item(i);
      if (wheelElement) {
        const angle = 360 / wheelElements.length;
        wheelElement.style.transform = "rotate(calc(" + angle + "deg * " + (i) + "))";
        wheelElement.style.clipPath = "polygon(0 0, " + this.polygonValues[wheelElements.length - 1] + "% 0, 100% 100%, 0 " + this.polygonValues[wheelElements.length - 1] + "%)";
      }
    }
    if (wheelElements.length > 18 && wheelElements.length <= 36){
      document.getElementById("wheel")!.style.fontSize = "12px";
    }else if (wheelElements.length > 36){
      document.getElementById("wheel")!.style.fontSize = "10px";
    }else{
      document.getElementById("wheel")!.style.fontSize = "16px";
    }
  }

  spinWheel() {
    let wheel = document.getElementById("wheel");
    let value;

    if (this.isOddSpin) {
      value = Math.ceil(Math.random() * 360) + 2000;
    } else {
      value = -(Math.ceil(Math.random() * 360) + 2000);
    }
    this.isOddSpin = !this.isOddSpin;
    wheel!.style.transform = "rotate(" + value + "deg)";
  }

  async getCurrentWheelElement() {
    while (this.isSpinning) {
      await this.wait(10).then(() => {
        this.getResult();
      })
    }
  }

  getResult() {
    let btn = document.getElementById("wheelBtn");
    let elements = document.elementsFromPoint(btn!.getBoundingClientRect().x - 25, btn!.getBoundingClientRect().y + (btn!.getBoundingClientRect().height) / 2);
    let currentWheelElement;

    for (let i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains("wheel__element") || elements[i].classList.contains("wheel__element3") ||  elements[i].classList.contains("wheel__element2") ||  elements[i].classList.contains("wheel__element1")) {
        currentWheelElement = elements[i];
        this.result = elements[i].getElementsByClassName("wheel__elementText").item(0)!.innerHTML;
      }
    }
    if (this.isSpinning && this.lastWheelElement != currentWheelElement) {
      this.playWheelSound()
      this.lastWheelElement = currentWheelElement;
    }
  }

  playWheelSound() {
    let audio = new Audio();
    audio.src = "../assets/sounds/wheel_click.mp3";
    audio.volume = 0.05;
    audio.load();
    audio.play().then(() => {
    });
  }

  changeWheelElement(event: any, i: number) {
    this.wheelElements[i] = event.target.value;
  }

  addEmptyWheelElement() {
    this.wheelElements.push("");
    this.wait(10).then(() => this.scrollDown())
  }

  removeWheelElement(i: number) {
    this.wheelElements.splice(i, 1);
  }

  shuffleWheelElements() {
    for (let i = this.wheelElements.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.wheelElements[i], this.wheelElements[j]] = [this.wheelElements[j], this.wheelElements[i]];
    }
  }

  sortWheelElements() {
    for (let i = 0; i < this.wheelElements.length; i++) {
      if (!parseInt(this.wheelElements[i], 10)) {
        this.wheelElements.sort();
        return;
      }
    }
    this.wheelElements.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  }

  scrollDown() {
    let div = document.getElementById("wheelInputs");
    div!.scroll({
      top: div!.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  onTrackBy(index: any) {
    return index;
  }

  wait(timeout: number) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

}
