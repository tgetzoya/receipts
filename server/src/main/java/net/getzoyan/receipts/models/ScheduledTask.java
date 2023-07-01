package net.getzoyan.receipts.models;

import jakarta.persistence.*;
import net.getzoyan.receipts.enums.ScheduleInterval;

import java.time.LocalDate;

@Entity(name = "scheduled")
public class ScheduledTask {
    private @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "repeat_interval")
    private ScheduleInterval interval;

    @Column(name = "next_date")
    private LocalDate nextDate;

    @Column(name = "reference_receipt_id")
    private long referenceReceiptId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ScheduleInterval getInterval() {
        return interval;
    }

    public void setInterval(ScheduleInterval interval) {
        this.interval = interval;
    }

    public LocalDate getNextDate() {
        return nextDate;
    }

    public void setNextDate(LocalDate nextDate) {
        this.nextDate = nextDate;
    }

    public long getReferenceReceiptId() {
        return referenceReceiptId;
    }

    public void setReferenceReceiptId(long referenceReceiptId) {
        this.referenceReceiptId = referenceReceiptId;
    }
}
