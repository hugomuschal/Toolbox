package de.hugo.controller;

import de.hugo.model.Room;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@CrossOrigin(origins = {"http://localhost:4200", "http://randomtools.de"})
@RestController
@RequestMapping(value = "/backend/room")
public final class RoomController {

    @GetMapping(value = "/rooms", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Room> rooms() {
        if (Room.getRoomList().isEmpty()) {
            return Flux.just(new Room());
        }
        return Flux.fromStream(Room.getRoomList().stream());
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<Integer> roomPing(@PathVariable long roomId) {
        Room room = Room.getRoomByID(roomId);
        int okCode = 0;
        if (room != null) {
            okCode = 1;
        }
        return new ResponseEntity<>(okCode, HttpStatus.OK);
    }

    @PostMapping("/newRoom")
    public ResponseEntity<Long> newRoom() {
        if (Room.getRoomList().size() >= 10000) {
            return new ResponseEntity<>(HttpStatus.TOO_MANY_REQUESTS);
        }

        Room room = new Room();
        Room.getRoomList().add(room);
        return new ResponseEntity<>(room.getRoomId(), HttpStatus.OK);
    }

    @PutMapping("/{roomId}/addMember")
    public ResponseEntity<Room> addMember(@PathVariable("roomId") long roomId) {
        Room room = Room.getRoomByID(roomId);
        if (room == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        room.addMember(Room.getMemberList().isEmpty());
        return new ResponseEntity<>(new Room(), HttpStatus.OK);
    }
}
