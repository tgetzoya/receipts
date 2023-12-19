package net.getzoyan.receipts.repositories;

import net.getzoyan.receipts.models.DrawAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DrawAccountRepository extends JpaRepository<DrawAccount, Long> {
    List<DrawAccount> findAllByOrderByNameAsc();

    @Query(value = "SELECT da.* FROM receipts.draw_account da LEFT JOIN receipts.receipts r ON r.draw_account = da.id WHERE (r.date > DATE_SUB(NOW(), INTERVAL '1' YEAR)) GROUP BY r.draw_account ORDER BY COUNT(r.draw_account) DESC", nativeQuery = true)
    List<DrawAccount> findAllByMostUsed();
}
