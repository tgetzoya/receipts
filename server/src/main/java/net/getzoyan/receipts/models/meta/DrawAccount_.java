package net.getzoyan.receipts.models.meta;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import net.getzoyan.receipts.models.DrawAccount;
import net.getzoyan.receipts.models.Location;
import net.getzoyan.receipts.models.Receipt;

import java.math.BigDecimal;
import java.time.LocalDate;

@StaticMetamodel(DrawAccount.class)
public class DrawAccount_ {
    public static volatile SingularAttribute<Receipt, Long> id;
    public static volatile SingularAttribute<Receipt, String> name;

    public static final String ID = "id";
    public static final String NAME = "name";
}