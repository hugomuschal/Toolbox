package de.hugo.model;

public class Member {

    public final int memberId;
    public boolean moderator;

    public Member(int id, boolean moderator) {
        this.memberId = id;
        this.moderator = moderator;
    }
}

