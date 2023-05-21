package net.getzoyan.receipts.controllers;

import net.getzoyan.receipts.exceptions.NotFoundException;
import net.getzoyan.receipts.models.DrawAccount;
import net.getzoyan.receipts.repositories.DrawAccountRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DrawAccountsController {
    private final DrawAccountRepository repository;

    DrawAccountsController(DrawAccountRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/draw-accounts")
    public List<DrawAccount> getAll() {
        return repository.findAll();
    }

    @PostMapping("/draw-account")
    public DrawAccount newDrawAccount(@RequestBody DrawAccount account) {
        return repository.save(account);
    }

    @GetMapping("/draw-account/{id}")
    public DrawAccount getSingleDrawAccount(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException(DrawAccount.class.getSimpleName(), id));
    }

    @PutMapping("/draw-account/{id}")
    public DrawAccount updateDrawAccount(@RequestBody DrawAccount account, @PathVariable Long id) {
        return repository.findById(id)
                .map(acc -> {
                    acc.setName(account.getName());
                    return repository.save(acc);
                }).orElseThrow(() -> new NotFoundException(DrawAccount.class.getSimpleName(), id));
    }
}
