import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../services/backend.service";


@Component({
  selector: 'app-public-room',
  templateUrl: './public-room.component.html',
  styleUrls: ['./public-room.component.scss']
})
export class PublicRoomComponent implements OnInit {

  constructor(private backend: BackendService) {
  }

  ngOnInit(): void {
  }

  newRoom(): void {
    this.backend.newRoom("");
  }

}
