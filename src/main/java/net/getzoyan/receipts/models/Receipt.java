package net.getzoyan.receipts.models;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity(name = "receipts")
public class Receipt {
    private @Id
    @GeneratedValue
    Long id;
    private String location;
    private BigDecimal subtotal;

    @Column(name = "sales_tax")
    private BigDecimal salesTax;
    private BigDecimal donation;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "draw_account", referencedColumnName = "id")
    private DrawAccount drawAccount;

    public Receipt() {

    }

    public Receipt(Long id,
                   String location,
                   BigDecimal subtotal,
                   BigDecimal salesTax,
                   BigDecimal donation,
                   DrawAccount drawAccount
    ) {
        this.id = id;
        this.location = location;
        this.subtotal = subtotal;
        this.salesTax = salesTax;
        this.donation = donation;
        this.drawAccount = drawAccount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
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
