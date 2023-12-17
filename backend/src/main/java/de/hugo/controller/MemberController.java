package de.hugo.controller;

import de.hugo.model.Member;
import de.hugo.model.Room;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.time.Duration;

/** receives and answers requests from the frontend regarding a member */
@CrossOrigin(origins = {"http://localhost:4200", "http://randomtools.de"})
@RestController
@RequestMapping(value = "/backend/member")
public final class MemberController {

    /**
     * checks every second for changes in the room, and if there are, send room data to clients
     * @param roomId unique identifier of a room
     * @param memberId unique identifier of a member
     * @param version current version number of this room
     * @return a Flux containing the ServerSideEvent with the room data
     */
    @GetMapping("/{roomId}/{memberId}/updateRoom/{version}")
    public Flux<ServerSentEvent<Room>> updateRoom(@PathVariable("roomId") long roomId, @PathVariable("memberId") int memberId, @PathVariable("version") int version) {

        int updateCheckDelay = 500; // Time in ms between each check for updates
        int updateDuration = 5; // Time in min until the update loop completes
        int headsUpDuration = 10; // Time in s before update loop completion, where client is given an update (min: 5s)

        int updateLoopCount = (updateDuration * 60000) / updateCheckDelay;
        int headsUpdLoopCount = updateLoopCount - (headsUpDuration * 1000) / updateCheckDelay;
        Room room = Room.getRoomByID(roomId);
        if (room != null) {
            Member member = room.getMemberById(memberId);
            if (member != null) {
                member.resetTimer(room);
                return Flux.range(0, updateLoopCount).delayElements(Duration.ofMillis(updateCheckDelay))
                        .map(sequence -> ServerSentEvent.<Room>builder()
                                .data((room.getVersion() > version || sequence >= headsUpdLoopCount) ? new Room() : null)
                                .build())
                        .doAfterTerminate(member::startTimer);
            }
        }
        return Flux.just(ServerSentEvent.builder(new Room()).build());
    }

    /**
     * change username
     * @param roomId unique identifier of a room
     * @param memberId unique identifier of a member
     * @param newName the new name for the specified member
     * @return an HttpStatus
     */
    @PutMapping("/{roomId}/{memberId}/changeName")
    public ResponseEntity<HttpStatus> changeName(@PathVariable("roomId") long roomId, @PathVariable("memberId") int memberId, @RequestBody String newName) {
        Room room = Room.getRoomByID(roomId);
        if (room == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (newName.length() > 20 || newName.contains("#")) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        room.changeMemberName(memberId, newName);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * remove a member from the room
     * @param roomId unique identifier of a room
     * @param memberId unique identifier of a member
     * @return an HttpStatus
     */
    @DeleteMapping("/{roomId}/{memberId}/remove")
    public ResponseEntity<HttpStatus> removeMember(@PathVariable("roomId") long roomId, @PathVariable("memberId") int memberId) {
        Room room = Room.getRoomByID(roomId);
        if (room == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        room.removeMember(memberId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

