package net.getzoyan.receipts.models;

import jakarta.persistence.*;
import net.getzoyan.receipts.enums.ScheduleInterval;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity(name = "scheduled")
public class Schedule {
    private @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "repeat_interval")
    private ScheduleInterval interval;

    @Column(name = "next_date")
    private LocalDate nextDate;

    @OneToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "location_id", referencedColumnName = "id")
    private Location location;

    private BigDecimal subtotal;

    @Column(name = "sales_tax")
    private BigDecimal salesTax;
    private BigDecimal donation;

    @OneToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "draw_account_id", referencedColumnName = "id")
    private DrawAccount drawAccount;

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

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getSalesTax() {
        return salesTax;
    }

    public void setSalesTax(BigDecimal salesTax) {
        this.salesTax = salesTax;
    }

    public BigDecimal getDonation() {
        return donation;
    }

    public void setDonation(BigDecimal donation) {
        this.donation = donation;
    }

    public DrawAccount getDrawAccount() {
        return drawAccount;
    }

    public void setDrawAccount(DrawAccount drawAccount) {
        this.drawAccount = drawAccount;
    }
}
