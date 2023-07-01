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

//    @Scheduled(fixedRate = 5000)
    @Scheduled(cron = "0 0 1 * * *")
    public void execute() {
        scheduleRepository.findAll(byDate(LocalDate.now())).forEach(scheduledTask -> {
            logger.info("Executing task {}", scheduledTask.getId());

            Receipt reference = receiptRepository.findById(scheduledTask.getReferenceReceiptId()).orElse(null);

            if (null == reference) {
                logger.error(
                        "Attempted to retrieve receipt {} but none found!",
                        scheduledTask.getReferenceReceiptId()
                );

                /* Skips this iteration and will continue on with the rest. */
                return;
            }

            Receipt newReceipt = new Receipt();
            newReceipt.setDrawAccount(reference.getDrawAccount());
            newReceipt.setSubtotal(reference.getSubtotal());
            newReceipt.setDate(LocalDate.now());
            newReceipt.setDonation(reference.getDonation());
            newReceipt.setSalesTax(reference.getSalesTax());
            newReceipt.setLocation(reference.getLocation());

            logger.info("Saving new receipt.");
            final Receipt retrievedReceipt = receiptRepository.save(newReceipt);

            noteRepository.findByReceiptId(reference.getId()).forEach(note -> {
                Note newNote = new Note();
                newNote.setNote(note.getNote());
                newNote.setReceiptId(retrievedReceipt.getId());

                noteRepository.save(newNote);
            });

            if (scheduledTask.getInterval().equals(ScheduleInterval.NONE)) {
                logger.info("Task is non-repeating, removing from scheduled tasks.");
                scheduleRepository.delete(scheduledTask);
            } else {
                switch (scheduledTask.getInterval()) {
                    case DAILY -> scheduledTask.setNextDate(scheduledTask.getNextDate().plusDays(1));
                    case WEEKLY -> scheduledTask.setNextDate(scheduledTask.getNextDate().plusWeeks(1));
                    case MONTHLY -> scheduledTask.setNextDate(scheduledTask.getNextDate().plusMonths(1));
                    case ANNUALLY -> scheduledTask.setNextDate(scheduledTask.getNextDate().plusYears(1));
                }

                logger.info("New task execution date for task: {}", scheduledTask.getNextDate());
                scheduleRepository.save(scheduledTask);
            }
        });

        logger.info("Daily task execution finished.");
    }
}
