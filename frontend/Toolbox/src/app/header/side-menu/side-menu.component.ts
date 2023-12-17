import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {HeaderComponent} from "../header.component";

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('100ms ease-in-out', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('100ms ease-in-out', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})
export class SideMenuComponent implements OnInit {

  constructor(public header: HeaderComponent) { }

  ngOnInit(): void {
  }

}
