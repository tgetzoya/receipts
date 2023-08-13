package net.getzoyan.receipts.controllers;

import net.getzoyan.receipts.enums.ScheduleInterval;
import net.getzoyan.receipts.exceptions.NotFoundException;
import net.getzoyan.receipts.models.Schedule;
import net.getzoyan.receipts.repositories.ScheduleRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static net.getzoyan.receipts.repositories.ScheduleRepository.Specs.byLocationId;

@RestController
@CrossOrigin(origins = "*")
public class ScheduleController {
    private final ScheduleRepository repository;

    ScheduleController(ScheduleRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/schedule")
    public List<Schedule> getAllSchedule() {
        return repository.findAll();
    }

    @GetMapping("/schedule/byId/{scheduleId}")
    public Schedule getScheduleById(@PathVariable Long scheduleId) {
        return repository
                .findById(scheduleId)
                .orElseThrow(() -> new NotFoundException(Schedule.class.getSimpleName(), scheduleId));
    }

    @GetMapping("/schedule/byLocationId/{locationId}")
    public Schedule getScheduleByLocation(@PathVariable Long locationId) {
        return repository
                .findOne(byLocationId(locationId))
                .orElseThrow(() -> new NotFoundException(Schedule.class.getSimpleName(), locationId));
    }

    @GetMapping("/schedule/intervals")
    public ScheduleInterval[] getScheduleIntervals() {
        return ScheduleInterval.values();
    }

    @PostMapping("/schedule")
    public Schedule createSchedule(@RequestBody Schedule schedule) {
        return repository.save(schedule);
    }

    @PutMapping("/schedule/{id}")
    public Schedule updateSchedule(@RequestBody Schedule schedule, @PathVariable Long id) {
        return repository.findById(id)
                .map(scheduled -> {
                    scheduled.setDonation(schedule.getDonation());
                    scheduled.setDrawAccount(schedule.getDrawAccount());
                    scheduled.setLocation(schedule.getLocation());
                    scheduled.setSalesTax(schedule.getSalesTax());
                    scheduled.setSubtotal(schedule.getSubtotal());
                    scheduled.setDrawAccount(schedule.getDrawAccount());
                    scheduled.setInterval(schedule.getInterval());

                    return repository.save(scheduled);
                }).orElseThrow(() -> new NotFoundException(Schedule.class.getSimpleName(), id));
    }

    @DeleteMapping("/schedule/{scheduleId}")
    public void deleteSchedule(@PathVariable Long scheduleId) {
        repository.deleteById(scheduleId);
    }
}
