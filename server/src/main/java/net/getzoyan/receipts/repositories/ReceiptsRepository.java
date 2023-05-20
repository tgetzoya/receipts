package net.getzoyan.receipts.repositories;

import net.getzoyan.receipts.models.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ReceiptsRepository extends JpaRepository<Receipt, Long> {
}
