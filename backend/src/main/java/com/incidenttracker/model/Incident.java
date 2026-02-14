package com.incidenttracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "incidents", indexes = {
    @Index(name = "idx_incidents_status", columnList = "status"),
    @Index(name = "idx_incidents_severity", columnList = "severity"),
    @Index(name = "idx_incidents_service", columnList = "service"),
    @Index(name = "idx_incidents_created_at", columnList = "createdAt")
})
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(nullable = false)
    private String service;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(length = 500)
    private String owner;

    @Column(length = 2000)
    private String summary;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    public Incident() {
    }

    public Incident(UUID id, String title, String service, Severity severity, Status status,
                    String owner, String summary, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.title = title;
        this.service = service;
        this.severity = severity;
        this.status = status;
        this.owner = owner;
        this.summary = summary;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    void timestamps() {
        Instant now = Instant.now();
        if (createdAt == null) createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private String title;
        private String service;
        private Severity severity;
        private Status status;
        private String owner;
        private String summary;

        public Builder title(String title) { this.title = title; return this; }
        public Builder service(String service) { this.service = service; return this; }
        public Builder severity(Severity severity) { this.severity = severity; return this; }
        public Builder status(Status status) { this.status = status; return this; }
        public Builder owner(String owner) { this.owner = owner; return this; }
        public Builder summary(String summary) { this.summary = summary; return this; }

        public Incident build() {
            Incident i = new Incident();
            i.title = title;
            i.service = service;
            i.severity = severity;
            i.status = status;
            i.owner = owner;
            i.summary = summary;
            return i;
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
    public Severity getSeverity() { return severity; }
    public void setSeverity(Severity severity) { this.severity = severity; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
