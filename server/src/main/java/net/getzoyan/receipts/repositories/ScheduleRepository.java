package net.getzoyan.receipts.repositories;

import net.getzoyan.receipts.models.Location;
import net.getzoyan.receipts.models.Schedule;
import net.getzoyan.receipts.models.meta.ScheduledTask_;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;

public interface ScheduleRepository extends JpaRepository<Schedule, Long>, JpaSpecificationExecutor<Schedule> {
    interface Specs {
        static Specification<Schedule> byDue() {
            return (root, query, builder) -> builder.lessThanOrEqualTo(root.get(ScheduledTask_.NEXT_DATE), LocalDate.now());
        }

        static Specification<Schedule> byLocation(Location location) {
            return (root, query, builder) -> builder.equal(root.get(ScheduledTask_.LOCATION), location);
        }

        static Specification<Schedule> byLocationId(Long locationId) {
            return (root, query, builder) -> builder.equal(root.get(ScheduledTask_.LOCATION).get("id"), locationId);
        }
    }
}
