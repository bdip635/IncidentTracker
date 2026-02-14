package com.incidenttracker.config;

import com.incidenttracker.model.Incident;
import com.incidenttracker.model.Severity;
import com.incidenttracker.model.Status;
import com.incidenttracker.repository.IncidentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.logging.Logger;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = Logger.getLogger(DataSeeder.class.getName());

    private static final String[] SERVICES = {
        "Payment-Gateway", "Auth-Service", "User-API", "Order-Service", "Inventory-Service",
        "Notification-Service", "Search-Index", "CDN-Edge", "Database-Primary", "Cache-Cluster",
        "Analytics-Pipeline", "Email-Service", "SMS-Gateway", "File-Storage", "API-Gateway"
    };

    private static final String[] TITLE_PREFIXES = {
        "High latency on", "Timeout errors in", "Outage affecting", "Degraded performance in",
        "Connection failures to", "5xx errors from", "Memory spike in", "CPU saturation in",
        "Disk full on", "Certificate expiry for", "Rate limit exceeded in", "Queue backlog in",
        "Replication lag in", "Failed health checks for", "Deployment rollback for"
    };

    private static final String[] OWNERS = {
        "alice@example.com", "bob@example.com", "carol@example.com", "dave@example.com",
        "eve@example.com", "frank@example.com", "grace@example.com", null, null
    };

    private static final String[] SUMMARIES = {
        "Investigating root cause.", "Mitigation applied, monitoring.",
        "Resolved after config change.", "Waiting on vendor response.",
        "Rollback completed successfully.", "Capacity increase in progress.",
        null, null, null
    };

    private final IncidentRepository incidentRepository;
    private final Random random = new Random(42);

    public DataSeeder(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    @Override
    public void run(String... args) {
        if (incidentRepository.count() > 0) {
            log.info("Database already seeded, skipping.");
            return;
        }
        log.info("Seeding database with ~200 incidents...");
        List<Incident> incidents = new ArrayList<>();
        for (int i = 0; i < 200; i++) {
            Incident inc = Incident.builder()
                .title(TITLE_PREFIXES[random.nextInt(TITLE_PREFIXES.length)] + " " + SERVICES[random.nextInt(SERVICES.length)])
                .service(SERVICES[random.nextInt(SERVICES.length)])
                .severity(Severity.values()[random.nextInt(Severity.values().length)])
                .status(Status.values()[random.nextInt(Status.values().length)])
                .owner(OWNERS[random.nextInt(OWNERS.length)])
                .summary(SUMMARIES[random.nextInt(SUMMARIES.length)])
                .build();
            incidents.add(inc);
        }
        incidentRepository.saveAll(incidents);
        log.info("Seeded " + incidentRepository.count() + " incidents.");
    }
}
