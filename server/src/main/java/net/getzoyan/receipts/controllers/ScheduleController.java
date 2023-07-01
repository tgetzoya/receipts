package net.getzoyan.receipts.controllers;

import net.getzoyan.receipts.exceptions.NotFoundException;
import net.getzoyan.receipts.models.Note;
import net.getzoyan.receipts.models.ScheduledTask;
import net.getzoyan.receipts.repositories.ScheduleRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class ScheduleController {
    private final ScheduleRepository repository;

    ScheduleController(ScheduleRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/schedule")
    public List<ScheduledTask> getAllSchedule() {
        return repository.findAll();
    }

    @GetMapping("/schedule/{scheduleId}")
    public ScheduledTask getSchedule(@PathVariable Long scheduleId) {
        return repository
                .findById(scheduleId)
                .orElseThrow(() -> new NotFoundException(Note.class.getSimpleName(), scheduleId));
    }

    @PostMapping("/schedule")
    public ScheduledTask createSchedule(@RequestBody ScheduledTask schedule) {
        return repository.save(schedule);
    }

    @PutMapping("/schedule")
    public ScheduledTask updateSchedule(@RequestBody ScheduledTask update) {
        return repository.findById(update.getId())
                .map(schedule -> {
                    schedule.setInterval(update.getInterval());
                    schedule.setNextDate(update.getNextDate());
                    schedule.setReferenceReceiptId(update.getReferenceReceiptId());
                    return repository.save(schedule);
                }).orElseThrow(() -> new NotFoundException(Note.class.getSimpleName(), update.getId()));
    }

    @DeleteMapping("/schedule/{scheduleId}")
    public void deleteSchedule(@PathVariable Long scheduleId) {
        repository.deleteById(scheduleId);
    }
}
