package net.getzoyan.receipts.jobs;

import net.getzoyan.receipts.enums.ScheduleInterval;
import net.getzoyan.receipts.models.Note;
import net.getzoyan.receipts.models.Receipt;
import net.getzoyan.receipts.repositories.NoteRepository;
import net.getzoyan.receipts.repositories.ReceiptRepository;
import net.getzoyan.receipts.repositories.ScheduleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import static net.getzoyan.receipts.repositories.ScheduleRepository.Specs.byDue;

@Component
public class ScheduledExecutor {
    private static final Logger logger = LoggerFactory.getLogger(ScheduledExecutor.class);

    private final ScheduleRepository scheduleRepository;
    private final ReceiptRepository receiptRepository;
    private final NoteRepository noteRepository;

    ScheduledExecutor(
            ScheduleRepository scheduleRepository,
            ReceiptRepository receiptRepository,
            NoteRepository noteRepository
    ) {
        this.scheduleRepository = scheduleRepository;
        this.receiptRepository = receiptRepository;
        this.noteRepository = noteRepository;
    }

//    @Scheduled(fixedRate = 5000)
    @Scheduled(cron = "0 0 1 * * *")
    public void execute() {
        scheduleRepository.findAll(byDue()).forEach(task -> {
            logger.info("Executing task {}", task.getId());

            LocalDate date = task.getNextDate();

            do {
                Receipt newReceipt = new Receipt();
                newReceipt.setDrawAccount(task.getDrawAccount());
                newReceipt.setSubtotal(task.getSubtotal());
                newReceipt.setDate(date);
                newReceipt.setDonation(task.getDonation());
                newReceipt.setSalesTax(task.getSalesTax());
                newReceipt.setLocation(task.getLocation());

                logger.info("Saving new receipt.");
                newReceipt = receiptRepository.save(newReceipt);

                Note newNote = new Note();
                newNote.setNote("Created by scheduled task #" + task.getId());
                newNote.setReceiptId(newReceipt.getId());
                noteRepository.save(newNote);

                date = calcNextDate(date, task.getInterval());
            } while (!task.getInterval().equals(ScheduleInterval.NONE) && date.isBefore(LocalDate.now()));

            if (task.getInterval().equals(ScheduleInterval.NONE)) {
                logger.info("Task is non-repeating, removing from scheduled tasks.");
                scheduleRepository.delete(task);
            } else {
                task.setNextDate(date);

                /* Log the actual stored value, in case something is wrong. */
                logger.info("New task execution date for task: {}", task.getNextDate());
                scheduleRepository.save(task);
            }
        });

        logger.info("Daily task execution finished.");
    }

    private LocalDate calcNextDate(LocalDate date, ScheduleInterval interval) {
        LocalDate newDate;

        switch (interval) {
            case DAILY -> newDate = date.plusDays(1);
            case WEEKLY -> newDate = date.plusWeeks(1);
            case MONTHLY -> newDate = date.plusMonths(1);
            case ANNUALLY -> newDate = date.plusYears(1);
            default -> {
                logger.info("Unknown interval {}", interval);
                newDate = date.plus(1, ChronoUnit.MILLENNIA);
            }
        }

        return newDate;
    }
}
