package net.getzoyan.receipts.models.meta;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import net.getzoyan.receipts.models.ScheduledTask;

import java.time.LocalDate;

@StaticMetamodel(ScheduledTask.class)
public class ScheduledTask_ {
    public static volatile SingularAttribute<ScheduledTask, Long> id;
    public static volatile SingularAttribute<ScheduledTask, LocalDate> nextDate;
    public static volatile SingularAttribute<ScheduledTask, Integer> interval;
    public static volatile SingularAttribute<ScheduledTask, Integer> referenceReceiptId;

    public static final String ID = "id";
    public static final String NEXT_DATE = "nextDate";
    public static final String INTERVAL = "interval";
    public static final String REFERENCE_RECEIPT_ID = "referenceReceiptId";
}