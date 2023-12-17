package de.hugo.controller;

import de.hugo.model.Member;
import de.hugo.model.Room;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

/**
 * receives and answers requests from the frontend regarding the room
 */
@CrossOrigin(origins = {"http://localhost:4200", "http://randomtools.de"})
@RestController
@RequestMapping(value = "/backend/room")
public final class RoomController {

    /**
     * get a list of all rooms (debug method)
     * or an empty room if none exist
     *
     * @return a ResponseEntity with a List of all rooms
     */
    @GetMapping(value = "/rooms", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Room> rooms() {
        if (Room.getRoomList().isEmpty()) {
            return Flux.just(new Room());
        }
        return Flux.fromStream(Room.getRoomList().stream());
    }

    /**
     * checks if specified room exists
     *
     * @param roomId the unique identifier of the requested room
     * @return a ResponseEntity containing 0 if the room doesn't exist, 1 if the room is ready to be entered and 2 if the room is already full
     */
    @GetMapping("/{roomId}")
    public ResponseEntity<Integer> roomPing(@PathVariable long roomId) {
        Room room = Room.getRoomByID(roomId);
        if (room == null) return new ResponseEntity<>(0, HttpStatus.OK);
        return new ResponseEntity<>(room.memberNames.size() < 35 ? 1 : 2, HttpStatus.OK);
    }

    /**
     * create a new room
     *
     * @return a ResponseEntity containing the unique identifier of the newly created room
     */
    @PostMapping("/newRoom")
    public ResponseEntity<Long> newRoom() {
        if (Room.getRoomList().size() >= 10000) {
            return new ResponseEntity<>(HttpStatus.TOO_MANY_REQUESTS);
        }

        Room room = new Room();
        Room.getRoomList().add(room);
        return new ResponseEntity<>(room.getRoomId(), HttpStatus.OK);
    }

    /**
     * add a member to the room
     *
     * @param roomId     the unique identifier of the room the member is to be added to
     * @param memberName a string containing the username of the member to be added
     * @return a Response Entity containing the data of the room the member was added to
     */
    @PutMapping("/{roomId}/{memberName}/addMember")
    public ResponseEntity<Room> addMember(@PathVariable("roomId") long roomId, @PathVariable String memberName) {
        Room room = Room.getRoomByID(roomId);
        if (room == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (memberName.length() > 20) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Member member = room.addMember(memberName);
        if (member == null) {
            return new ResponseEntity<>(HttpStatus.TOO_MANY_REQUESTS);
        }
        return new ResponseEntity<>(new Room(), HttpStatus.OK);
    }


    /**
     * reveal all cards
     *
     * @param roomId a unique identifier of the room in which the cards are to be revealed
     * @return an HttpStatus
     */
    @GetMapping("/{roomId}/reveal")
    public ResponseEntity<HttpStatus> reveal(@PathVariable("roomId") long roomId) {
        Room room = Room.getRoomByID(roomId);
        if (room == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * start a new round
     *
     * @param roomId a unique identifier of the room in which a new round is to be started
     * @return an HttpStatus
     */
    @GetMapping("/{roomId}/newRound")
    public ResponseEntity<HttpStatus> newRound(@PathVariable("roomId") long roomId) {
        Room room = Room.getRoomByID(roomId);
        if (room == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        room.newRound();
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
