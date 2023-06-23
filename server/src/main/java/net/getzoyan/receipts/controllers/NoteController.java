package net.getzoyan.receipts.controllers;

import net.getzoyan.receipts.exceptions.NotFoundException;
import net.getzoyan.receipts.models.Note;
import net.getzoyan.receipts.models.Receipt;
import net.getzoyan.receipts.repositories.NoteRepository;
import net.getzoyan.receipts.repositories.ReceiptRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class NoteController {
    private final NoteRepository noteRepository;
    private final ReceiptRepository receiptRepository;

    NoteController(NoteRepository noteRepository, ReceiptRepository receiptRepository) {
        this.noteRepository = noteRepository;
        this.receiptRepository = receiptRepository;
    }

    @GetMapping("/notes/{receiptId}")
    public List<Note> getNotesForReceipt(@PathVariable Long receiptId) {
        Optional<Receipt> receipt = receiptRepository.findById(receiptId);

        if (receipt.isEmpty()) {
            throw new NotFoundException(Receipt.class.getSimpleName(), receiptId);
        }

        return noteRepository.findByReceiptId(receipt.get().getId());
    }

    @PostMapping("/note")
    public Note newNote(@RequestBody Note Note) {
        return noteRepository.save(Note);
    }

    @PutMapping("/note")
    public Note updateNote(@RequestBody Note update) {
        return noteRepository.findById(update.getId())
                .map(note -> {
                    note.setNote(update.getNote());
                    return noteRepository.save(note);
                }).orElseThrow(() -> new NotFoundException(Note.class.getSimpleName(), update.getId()));
    }

    @DeleteMapping("/note/{id}")
    public void removeNote(@PathVariable Long id) {
        noteRepository.deleteById(id);
    }
}
