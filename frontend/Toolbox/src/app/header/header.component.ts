import {Component, HostListener} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @HostListener('document:click', ['$event']) onDocumentClick() {
    this.sideMenuIsOpened = false;
  }

  constructor(public router: Router) {
  }

  sideMenuIsOpened: boolean = false;
}
