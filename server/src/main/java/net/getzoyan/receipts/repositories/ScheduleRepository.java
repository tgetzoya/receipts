package net.getzoyan.receipts.repositories;

import net.getzoyan.receipts.models.ScheduledTask;
import net.getzoyan.receipts.models.meta.ScheduledTask_;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;

public interface ScheduleRepository extends JpaRepository<ScheduledTask, Long>, JpaSpecificationExecutor<ScheduledTask> {
    interface Specs {
        static Specification<ScheduledTask> byDate(LocalDate nextDate) {
            return (root, query, builder) -> builder.equal(root.get(ScheduledTask_.NEXT_DATE), nextDate);
        }
    }
}
