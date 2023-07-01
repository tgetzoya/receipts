package net.getzoyan.receipts.enums;

public enum ScheduleInterval {
    NONE(0),
    DAILY(1),
    WEEKLY(7),
    MONTHLY(30),
    ANNUALLY(365);

    private int interval;

    ScheduleInterval(int interval) {
        this.interval = interval;
    }
}
