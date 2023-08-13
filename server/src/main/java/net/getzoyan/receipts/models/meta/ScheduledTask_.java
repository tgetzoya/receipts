package net.getzoyan.receipts.models.meta;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import net.getzoyan.receipts.models.DrawAccount;
import net.getzoyan.receipts.models.Location;
import net.getzoyan.receipts.models.Schedule;

import java.math.BigDecimal;
import java.time.LocalDate;

@StaticMetamodel(Schedule.class)
public class ScheduledTask_ {
    public static volatile SingularAttribute<Schedule, BigDecimal> donation;
    public static volatile SingularAttribute<Schedule, DrawAccount> drawAccount;
    public static volatile SingularAttribute<Schedule, Long> id;
    public static volatile SingularAttribute<Schedule, Integer> interval;
    public static volatile SingularAttribute<Schedule, Location> location;
    public static volatile SingularAttribute<Schedule, LocalDate> nextDate;
    public static volatile SingularAttribute<Schedule, BigDecimal> salesTax;
    public static volatile SingularAttribute<Schedule, BigDecimal> subtotal;

    public static final String DRAW_ACCOUNT = "drawAccount";
    public static final String ID = "id";
    public static final String INTERVAL = "interval";
    public static final String LOCATION = "location";
    public static final String NEXT_DATE = "nextDate";
    public static final String SALES_TAX = "salesTax";
    public static final String SUBTOTAL = "subtotal";
}