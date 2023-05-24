package net.getzoyan.receipts.controllers;

import net.getzoyan.receipts.exceptions.NotFoundException;
import net.getzoyan.receipts.models.Receipt;
import net.getzoyan.receipts.repositories.ReceiptsRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class ReceiptsController {
    private final ReceiptsRepository repository;

    ReceiptsController(ReceiptsRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/receipts")
    public List<Receipt> getAll() {
        return repository.findAll();
    }

    @PostMapping("/receipt")
    public Receipt newReceipt(@RequestBody Receipt receipt) {
        return repository.save(receipt);
    }

    @GetMapping("/receipt/{id}")
    public Receipt getSingleReceipt(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException(Receipt.class.getSimpleName(), id));
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
