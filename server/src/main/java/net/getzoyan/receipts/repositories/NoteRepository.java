package net.getzoyan.receipts.repositories;

import net.getzoyan.receipts.models.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByReceiptId(Long receiptId);
}
