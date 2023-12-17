package de.hugo.model;

import java.util.*;

/** represents a user in the room */
public class Member {

    /** unique identifier for the member in the room */
    public final int memberId;
    /** specified username */
    private String name;
    /** Timer to remove the member from the room, if the corresponding client don't respond to an update within 5s */
    private Timer timer;
    /** TimerTask for 5s Timer */
    private TimerTask timerTask;
    /** true if the 5s timer is currently running */
    private boolean timerIsRunning;

    /**
     * Constructor
     * @param id the unique identifier of this member
     * @param name the username of this member
     */
    public Member(int id, String name) {
        this.memberId = id;
        this.name = name;
    }

    /**
     * change own username
     * @param newName the new name for this member
     * @return true if new name is different from the old name
     */
    public boolean changeName(String newName) {
        if (!Objects.equals(name, newName)) {
            name = newName;
            return true;
        }
        return false;
    }


    /** start the 5s Timer */
    public void startTimer() {
        if (!timerIsRunning) {
            timer.schedule(timerTask, 5000);
            timerIsRunning = true;
        }
    }

    /** reset the 5s Timer */
    public void resetTimer(Room room) {
        if (timer != null) {
            timer.cancel();
            timerTask.cancel();
            timer.purge();
        }
        timerIsRunning = false;
        timer = new Timer();
        timerTask = new TimerTask() {
            @Override
            public void run() {
                if (room != null) {
                    room.removeMember(memberId);
                }
            }
        };
    }


    /** getter for name */
    public String getName() {
        return name;
    }

}

