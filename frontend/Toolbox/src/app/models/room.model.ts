import {Member} from "./member.model";
export class Room {
  roomId : number = 0;
  member: Member = new Member();
  version : number = 0;
  /** true if a room was joined */
  joinedARoom: boolean = false;
  /** number of players who can vote */
  numberOfPlayers: number = 0;
}
