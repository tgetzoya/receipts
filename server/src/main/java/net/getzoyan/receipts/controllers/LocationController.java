package net.getzoyan.receipts.controllers;

import net.getzoyan.receipts.exceptions.NotFoundException;
import net.getzoyan.receipts.models.Location;
import net.getzoyan.receipts.repositories.LocationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class LocationController {
    private final LocationRepository repository;

    LocationController(LocationRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/locations")
    public List<Location> getAll() {
        return repository.findAll();
    }

    @PostMapping("/location")
    public Location newLocation(@RequestBody Location location) {
        return repository.save(location);
    }

    @GetMapping("/location/{id}")
    public Location getSingleLocation(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException(Location.class.getSimpleName(), id));
    }

    @PutMapping("/location/{id}")
    public Location updateLocation(@RequestBody Location location, @PathVariable Long id) {
        return repository.findById(id)
                .map(acc -> {
                    acc.setName(location.getName());
                    return repository.save(acc);
                }).orElseThrow(() -> new NotFoundException(Location.class.getSimpleName(), id));
    }
}
