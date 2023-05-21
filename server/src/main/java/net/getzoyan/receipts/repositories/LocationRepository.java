package net.getzoyan.receipts.repositories;

import net.getzoyan.receipts.models.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, Long> {
}
