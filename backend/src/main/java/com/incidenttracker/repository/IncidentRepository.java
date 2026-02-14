package com.incidenttracker.repository;

import com.incidenttracker.model.Incident;
import com.incidenttracker.model.Severity;
import com.incidenttracker.model.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, java.util.UUID> {

    @Query("SELECT DISTINCT i.service FROM Incident i ORDER BY i.service")
    List<String> findDistinctServices();

    @Query("""
        SELECT i FROM Incident i WHERE
        (:search IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', :search, '%'))
         OR LOWER(i.service) LIKE LOWER(CONCAT('%', :search, '%'))
         OR (i.summary IS NOT NULL AND LOWER(i.summary) LIKE LOWER(CONCAT('%', :search, '%')))
         OR (i.owner IS NOT NULL AND LOWER(i.owner) LIKE LOWER(CONCAT('%', :search, '%'))))
        AND (:status IS NULL OR i.status = :status)
        AND (:severity IS NULL OR i.severity = :severity)
        AND (:service IS NULL OR LOWER(i.service) = LOWER(:service))
        """)
    Page<Incident> findAllFiltered(
        @Param("search") String search,
        @Param("status") Status status,
        @Param("severity") Severity severity,
        @Param("service") String service,
        Pageable pageable
    );
}
