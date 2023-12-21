package de.hugo.model;

import java.util.*;

public class Room {

    private static final List<Room> roomList = new ArrayList<>();
    private final long roomId;
    private static final List<Member> members = new ArrayList<>();
    private int numberOfPlayers = 0;
    private int version = 0;
    private final Random random = new Random();

    public Room() {
        this.roomId = generateRoomID();
    }

    private long generateRoomID() {
        long id = random.nextLong((long) Math.pow(10, 12));
        if (getRoomByID(id) != null || id == 0) {
            return generateRoomID();
        }
        return id;
    }

    private int generateMemberID() {
        int id = random.nextInt((int) Math.pow(10, 9));
        for (Member member : members) {
            if (member.memberId == id) {
                return generateMemberID();
            }
        }
        return id;
    }

    public static Room getRoomByID(long roomId) {
        for (Room room : roomList) {
            if (room.getRoomId() == roomId) {
                return room;
            }
        }
        return null;
    }

    public Member getMemberById(int id) {
        for (Member member : members) {
            if (member.memberId == id) {
                return member;
            }
        }
        return null;
    }

    public long getRoomId() {
        return roomId;
    }

    public int getVersion() {
        return version;
    }

    public static List<Room> getRoomList() {
        return roomList;
    }

    public static List<Member> getMemberList() {
        return members;
    }

    public void incrementVersion() {
        ++version;
    }

    public synchronized void addMember(boolean moderator) {
        Member member = new Member(generateMemberID(), moderator);
        members.add(member);
        ++numberOfPlayers;
        incrementVersion();
    }

    public synchronized void removeMember(int memberId) {
        Member member = getMemberById(memberId);
        if (member != null) {
            members.remove(member);
            incrementVersion();
        }
    }

    public static void setRoomList(Room room, boolean adding) {
        if (adding) {
            roomList.add(room);
        } else {
            roomList.remove(room);
        }
    }


    /**
     * getter for numberOfPlayers
     */
    public int getNumberOfPlayers() {
        return numberOfPlayers;
    }

    /**
     * increase or decrease numberOfPlayers by one
     *
     * @param increase true if numberOfPlayers should be increased, false if decreased
     */
    public void incNumberOfPlayers(boolean increase) {
        if (increase) {
            ++numberOfPlayers;
        } else {
            --numberOfPlayers;
        }
    }
}
