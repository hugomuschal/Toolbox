package de.hugo.controller;

import de.hugo.model.Member;
import de.hugo.model.Room;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.time.Duration;

@CrossOrigin(origins = {"http://localhost:4200", "https://randomtools.de"})
@RestController
@RequestMapping(value = "/backend/member")
public final class MemberController {

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
                return Flux.range(0, updateLoopCount).delayElements(Duration.ofMillis(updateCheckDelay))
                        .map(sequence -> ServerSentEvent.<Room>builder()
                                .data((room.getVersion() > version || sequence >= headsUpdLoopCount) ? new Room() : null)
                                .build());
            }
        }
        return Flux.just(ServerSentEvent.builder(new Room()).build());
    }

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

