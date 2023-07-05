package net.getzoyan.receipts.jobs;

import net.getzoyan.receipts.enums.ScheduleInterval;
import net.getzoyan.receipts.models.Note;
import net.getzoyan.receipts.models.Receipt;
import net.getzoyan.receipts.models.ScheduledTask;
import net.getzoyan.receipts.repositories.NoteRepository;
import net.getzoyan.receipts.repositories.ReceiptRepository;
import net.getzoyan.receipts.repositories.ScheduleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static net.getzoyan.receipts.repositories.ScheduleRepository.Specs.byDate;

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

    @Scheduled(cron = "0 0 1 * * *")
    public void execute() {
        scheduleRepository.findAll(byDate(LocalDate.now())).stream().forEach(task -> {
            logger.info("Executing task {}", task.getId());

            Receipt newReceipt = new Receipt();
            newReceipt.setDrawAccount(task.getDrawAccount());
            newReceipt.setSubtotal(task.getSubtotal());
            newReceipt.setDate(LocalDate.now());
            newReceipt.setDonation(task.getDonation());
            newReceipt.setSalesTax(task.getSalesTax());
            newReceipt.setLocation(task.getLocation());

            logger.info("Saving new receipt.");
            newReceipt = receiptRepository.save(newReceipt);

            Note newNote = new Note();
            newNote.setNote("Created by scheduled task #" + task.getId());
            newNote.setReceiptId(newReceipt.getId());
            noteRepository.save(newNote);

            if (task.getInterval().equals(ScheduleInterval.NONE)) {
                logger.info("Task is non-repeating, removing from scheduled tasks.");
                scheduleRepository.delete(task);
            } else {
                switch (task.getInterval()) {
                    case DAILY -> task.setNextDate(task.getNextDate().plusDays(1));
                    case WEEKLY -> task.setNextDate(task.getNextDate().plusWeeks(1));
                    case MONTHLY -> task.setNextDate(task.getNextDate().plusMonths(1));
                    case ANNUALLY -> task.setNextDate(task.getNextDate().plusYears(1));
                    default -> {
                        logger.info("Unknown interval {}", task.getInterval());
                        task.setNextDate(task.getNextDate().plus(1, ChronoUnit.MILLENNIA));
                    }
                }

                logger.info("New task execution date for task: {}", task.getNextDate());
                scheduleRepository.save(task);
            }
        });

        logger.info("Daily task execution finished.");
    }
}
