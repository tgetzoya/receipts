package net.getzoyan.receipts.models.meta;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import net.getzoyan.receipts.models.DrawAccount;
import net.getzoyan.receipts.models.Location;
import net.getzoyan.receipts.models.Receipt;

import java.math.BigDecimal;
import java.time.LocalDate;

@StaticMetamodel(Receipt.class)
public class Receipt_ {
    public static volatile SingularAttribute<Receipt, Long> id;
    public static volatile SingularAttribute<Receipt, LocalDate> date;
    public static volatile SingularAttribute<Receipt, Location> location;
    public static volatile SingularAttribute<Receipt, BigDecimal> subtotal;
    public static volatile SingularAttribute<Receipt, BigDecimal> salesTax;
    public static volatile SingularAttribute<Receipt, BigDecimal> donation;
    public static volatile SingularAttribute<Receipt, DrawAccount> drawAccount;

    public static final String ID = "id";
    public static final String DATE = "date";
    public static final String LOCATION = "location";
    public static final String SUBTOTAL = "subtotal";
    public static final String SALESTAX = "salesTax";
    public static final String DONATION = "donation";
    public static final String DRAWACCOUNT = "drawAccount";
}