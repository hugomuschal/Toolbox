import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Room} from "../models/room.model";
import {Router} from "@angular/router";
import properties from "../../assets/properties.json";


@Injectable({
  providedIn: 'root'
})

export class BackendService {

  /** used for update request */
  es: EventSource | undefined;

  constructor(
    private http: HttpClient,
    private _router: Router,
    private ngZone: NgZone,
  ) {
  }

  newRoom(game: string): Observable<number> {
    return this.http.post<number>(`${properties.roomUrl}/newRoom`, game);
  }

  requestUpdates(roomId: number, memberId: number, version: number): Promise<Room> {
    let resolveRef: (value: Room | PromiseLike<Room>) => void;
    let rejectRef: (reason?: any) => void;

    let dataPromise: Promise<Room> = new Promise((resolve, reject) : void => {
      resolveRef = resolve;
      rejectRef = reject;
    })
    let roomObject: Room;
    this.es = new EventSource(`${properties.memberUrl}/${roomId}/${memberId}/updateRoom/${version}`);

    const retryCycle = (errorCount: number) : void => {
      this.es.onerror = (): void => {
        this.ngZone.run((): void => {
          this.es?.close();
          if (errorCount >= 5) {
            window.alert("Ein unerwarteter Fehler ist aufgetreten.\nDu wirst auf die Startseite weitergeleitet.");
            this._router.navigate(["/"]).then((): void => {
              location.reload();
              rejectRef();
            });
          } else {
            retryCycle(errorCount + 1);
          }
        })
      };
      this.es.onmessage = (me: MessageEvent): void => {
        this.es?.close();
        roomObject = JSON.parse(me.data);
        if (roomObject.roomId == 0) {
          window.alert("Ein Verbindungsfehler ist aufgetreten oder der Raum wurde geschlossen.\nDu wirst auf die Startseite weitergeleitet.");
          this._router.navigate(["/"]).then((): void => {
            location.reload();
            rejectRef();
          });
        } else {
          resolveRef(roomObject);
        }
      };
    };
    retryCycle(0);
    return dataPromise;
  }

  /**
   * checks if the specified room is open
   * @param roomId the unique identifier of this room
   * @returns an Observable containing true if the requested room is open
   */
  private roomPing(roomId: number): Observable<number> {
    return this.http.get<number>(`${properties.roomUrl}/${roomId}`);
  }

  /**
   * change the card deck
   * @param roomId the unique identifier of this room
   * @param setOfCards the card deck used in this room
   * @returns an empty Observable
   */
  changeSetOfCards(roomId: number, setOfCards: string[]): Observable<any> {
    return this.http.put(`${properties.roomUrl}/${roomId}/changeSetOfCards`, setOfCards.toString());
  }

  addMember(roomId: number, isModerator: boolean): Promise<Room> {
    let resolveRef: (value: Room | PromiseLike<Room>) => void;
    let rejectRef: (reason?: any) => void;

    let dataPromise: Promise<Room> = new Promise((resolve, reject) : void => {
      resolveRef = resolve;
      rejectRef = reject;
    })
    let roomObject: Room;

    this.roomPing(roomId).subscribe((data: number) : void => {
      switch (data) {
        case 1:
          this.http.put<Room>(`${properties.roomUrl}/${roomId}/addMember`, roomId).subscribe(
            (data : Room) : void => {
              data.joinedARoom = true;
              resolveRef(roomObject);
            });
          break;
        default:
          window.alert("Der angefragte Raum konnte nicht gefunden werden.\nDu wirst auf die Startseite weitergeleitet.");
          this._router.navigate(["/"]).then(() : void => {
            location.reload();
            rejectRef();
          });
      }
    });
    return dataPromise;
  }
  removeMember(roomId: number, memberId: number): Observable<any> {
    return this.http.delete(`${properties.memberUrl}/${roomId}/${memberId}/remove`);
  }

  newRound(roomId: number): Observable<any> {
    return this.http.get(`${properties.roomUrl}/${roomId}/newRound`);
  }
}
