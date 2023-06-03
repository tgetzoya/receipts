package net.getzoyan.receipts.repositories;

import net.getzoyan.receipts.models.Receipt;
import net.getzoyan.receipts.models.meta.Receipt_;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;


public interface ReceiptsRepository extends JpaRepository<Receipt, Long>, JpaSpecificationExecutor<Receipt> {
    interface Specs {
        static Specification<Receipt> byId(Long id) {
            return (root, query, builder) -> builder.equal(root.get(Receipt_.ID), id);
        }

        static Specification<Receipt> byDate(LocalDate date) {
            return (root, query, builder) -> builder.equal(root.get(Receipt_.DATE), date);
        }

        static Specification<Receipt> byLocation(Long locationId) {
            return (root, query, builder) -> builder.equal(root.get(Receipt_.LOCATION).get("id"), locationId);
        }

        static Specification<Receipt> byDrawAccount(Long drawAccountId) {
            return (root, query, builder) -> builder.equal(root.get(Receipt_.DRAWACCOUNT).get("id"), drawAccountId);
        }

        static Specification<Receipt> byYear(int year) {
            LocalDate startDate = LocalDate.of(year, 1, 1);
            LocalDate endDate = LocalDate.of(year, 12, 31);

            return (root, query, builder) -> builder.between(root.get(Receipt_.DATE), startDate, endDate);
        }
    }
}
