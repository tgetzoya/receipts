package net.getzoyan.receipts.repositories;

import net.getzoyan.receipts.models.DrawAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DrawAccountRepository extends JpaRepository<DrawAccount, Long> {
}
