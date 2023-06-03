package net.getzoyan.receipts.controllers;

import net.getzoyan.receipts.exceptions.NotFoundException;
import net.getzoyan.receipts.models.Receipt;
import net.getzoyan.receipts.repositories.ReceiptsRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import static net.getzoyan.receipts.repositories.ReceiptsRepository.Specs.*;

@RestController
@CrossOrigin(origins = "*")
public class ReceiptsController {
    private final ReceiptsRepository repository;

    ReceiptsController(ReceiptsRepository repository) {
        this.repository = repository;
    }

    @GetMapping({"/receipts", "/receipts/{year}"})
    public List<Receipt> getReceiptsForYear(@PathVariable(required = false) Integer year) {
        if (year == null) {
            year = LocalDate.now().getYear();
        }

        return repository.findAll(byYear(year));
    }

    @GetMapping("/receipt/{id}")
    public Receipt getSingleReceipt(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException(Receipt.class.getSimpleName(), id));
    }

    @GetMapping("/receipts/date/{date}")
    public List<Receipt> getReceiptsOnDate(@PathVariable LocalDate date) {
        return repository.findAll(byDate(date));
    }

    @GetMapping("/receipts/location/{locationId}")
    public List<Receipt> getReceiptsByLocation(@PathVariable Long locationId) {
        return repository.findAll(byLocation(locationId));
    }

    @GetMapping("/receipts/date/{date}/location/{locationId}")
    public List<Receipt> getReceiptsOnDateAndByLocation(@PathVariable LocalDate date, @PathVariable Long locationId) {
        return repository.findAll(byDate(date).and(byLocation(locationId)));
    }

    @GetMapping("/receipts/draw-account/{drawAccount}")
    public List<Receipt> getReceiptsOByDrawAccount(@PathVariable Long drawAccount) {
        return repository.findAll(byDrawAccount(drawAccount));
    }

    @PostMapping("/receipt")
    public Receipt newReceipt(@RequestBody Receipt receipt) {
        return repository.save(receipt);
    }

    @PutMapping("/receipt/{id}")
    public Receipt updateReceipt(@RequestBody Receipt receipt, @PathVariable Long id) {
        return repository.findById(id)
                .map(rec -> {
                    rec.setDonation(receipt.getDonation());
                    rec.setDrawAccount(receipt.getDrawAccount());
                    rec.setLocation(receipt.getLocation());
                    rec.setSalesTax(receipt.getSalesTax());
                    rec.setSubtotal(receipt.getSubtotal());
                    rec.setDrawAccount(receipt.getDrawAccount());

                    return repository.save(rec);
                }).orElseThrow(() -> new NotFoundException(Receipt.class.getSimpleName(), id));
    }

    @DeleteMapping("/receipt/{id}")
    public void removeReceipt(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
