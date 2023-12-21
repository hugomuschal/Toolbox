import {AfterViewInit, Component} from '@angular/core';

@Component({
  selector: 'app-wheel',
  templateUrl: './wheel.component.html',
  styleUrls: ['./wheel.component.scss']
})
export class WheelComponent implements AfterViewInit {

  polygonValues: number[] = [0, 0, 0, 101, 85, 75, 66, 60, 54, 50, 46, 43, 40, 38, 36, 34, 32, 31, 29, 28];   //polygonValues for 4-20 elements in wheel
  //wheelElements: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]
  wheelElements: string[] = ["Justin", "Christoffer", "Florian", "Hugo", "Jonas", "Sebastian", "Phillip", "Kai-Uwe", "Gian-Luca", "Dennis", "Matthias", "Peter", "Christian", "Jonathan", "Jenny", "Antonia", "Elisabeth", "Erik", "Susanne", "Claudia"]
  result: string = "";
  oddSpin: boolean = true;    //to make rotate angle +/-
  isSpinning: boolean = false
  lastWheelElement: string = "";

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

  }

  spinWheel() {
    let wheel = document.getElementById("wheel");
    let value;

    if (this.oddSpin) {
      value = Math.ceil(Math.random() * 360) + 2000;
    } else {
      value = -(Math.ceil(Math.random() * 360) + 2000);
    }
    this.oddSpin = !this.oddSpin;
    wheel!.style.transform = "rotate(" + value + "deg)";
  }

  async getCurrentWheelElement(){
    while (this.isSpinning){
      await this.wait(10).then(() => {
        this.getResult();
      })
    }
  }

  getResult() {
    let btn = document.getElementById("wheelBtn");
    let elements = document.elementsFromPoint(btn!.getBoundingClientRect().x - 25, btn!.getBoundingClientRect().y + 26);

    //check if wheelElement or wheelElementText got detected
    if (!elements[0].getElementsByClassName("wheel__elementText").item(0)){
     this.result = elements[0].innerHTML;
    }else{
      this.result = elements[0].getElementsByClassName("wheel__elementText").item(0)!.innerHTML;
    }
    if (this.isSpinning && this.lastWheelElement != this.result){
      this.playWheelSound()
      this.lastWheelElement = this.result;
    }
  }

  playWheelSound(){
    let audio = new Audio();
    audio.src = "../assets/sounds/wheel_click.mp3";
    audio.volume = 0.05;
    audio.load();
    audio.play().then(() => {});
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
