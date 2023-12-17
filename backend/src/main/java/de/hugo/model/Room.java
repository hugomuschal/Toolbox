package de.hugo.model;
import java.util.*;

/** represents a Poker room */
public class Room {

    /** a list of all open rooms */
    private static final List<Room> roomList = new ArrayList<>();
    /** the unique identifier for this room */
    private final long roomId;
    /** a list of all members in the room */
    private final List<Member> members = new ArrayList<>();
    /** a list of the names of all members in the room */
    public final List<String> memberNames = new ArrayList<>();
    /** Number of members that can vote */
    private int numberOfPlayers = 0;
    /** current version of the room; used to track if changes occurred */
    private int version = 0;
    /** random number generator */
    private final Random random = new Random();

    /**
     * Constructor for empty Room
     */
    public Room() {
        this.roomId = generateRoomID();
    }

    /**
     * generate the roomId
     * @return the generated roomId
     */
    private long generateRoomID() {
        long id = random.nextLong((long) Math.pow(10, 12));
        if (getRoomByID(id) != null || id == 0) {
            return generateRoomID();
        }
        return id;
    }

    /**
     * generate the memberId
     * @return the generated memberId
     */
    private int generateMemberID() {
        int id = random.nextInt((int) Math.pow(10, 9));
        for (Member member : members) {
            if (member.memberId == id) {
                return generateMemberID();
            }
        }
        return id;
    }

    /**
     * get the room instance corresponding to the provided roomId
     * @param roomId the unique identifier of the queried room
     * @return the room corresponding to the provided roomId and null if not found
     */
    public static Room getRoomByID(long roomId) {
        for (Room room : roomList) {
            if (room.getRoomId() == roomId) {
                return room;
            }
        }
        return null;
    }

    /**
     * get the member instance corresponding to the provided memberId
     * @param id the unique identifier of the queried member
     * @return the member corresponding to the provided memberId and null if not found
     */
    public Member getMemberById(int id) {
        for (Member member : members) {
            if (member.memberId == id) {
                return member;
            }
        }
        return null;
    }

    /**
     * get the roomId of this room
     * @return the roomId of this room
     */
    public long getRoomId() {
        return roomId;
    }

    /**
     * get the current version of this room
     * @return the current version of this room
     */
    public int getVersion() {
        return version;
    }



    /**
     * increase the current version by one, when changes occur
     * starts the 5s Timer for each member
     * restarts the 1-Month-Timer of this room
     */
    public void incrementVersion() {
        for (Member member : members) {
            member.startTimer();
        }
        ++version;
    }

    /**
     * add a member to this room
     * @param memberName the name of the member to be added to the room
     * @return the instance of the member added
     */
    public synchronized Member addMember(String memberName) {
        if (members.size() < 35) {
            Member member = new Member(generateMemberID(), memberName);
            members.add(member);
            memberNames.add(memberName);
            ++numberOfPlayers;
            incrementVersion();
            return member;
        } else {
            return null;
        }
    }

    /**
     * remove a member to this room
     * @param memberId the unique identifier of the member to be removed from the room
     */
    public synchronized void removeMember(int memberId) {
        Member member = getMemberById(memberId);
        if (member != null) {
            int index = members.indexOf(member);
            memberNames.remove(index);
            members.remove(member);
            incrementVersion();
        }
        if (members.isEmpty()) {
            newRound();
        }
    }

    /**
     * change the username of a member in this room
     * @param memberId the unique identifier of the member which name is to be changed
     * @param newName the new name for the requested member
     */
    public void changeMemberName(int memberId, String newName) {
        Member member = getMemberById(memberId);
        if (member != null && member.changeName(newName)) {
            memberNames.set(members.indexOf(member), newName);
            incrementVersion();
        }
    }


    /** start a  new round */
    public void newRound() {
        incrementVersion();
    }


    /** getter for roomList */
    public static List<Room> getRoomList() {
        return roomList;
    }

    /**
     * setter for roomList
     * @param room the Room to be added or removed from the roomList
     * @param adding true if the supplied room is supposed to be added and false if it is supposed to be removed
     */
    public static void setRoomList(Room room, boolean adding) {
        if (adding) {
            roomList.add(room);
        } else {
            roomList.remove(room);
        }
    }


    /** getter for numberOfPlayers */
    public int getNumberOfPlayers() {
        return numberOfPlayers;
    }

    /**
     * increase or decrease numberOfPlayers by one
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
