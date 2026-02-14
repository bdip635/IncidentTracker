package com.incidenttracker.dto;

import com.incidenttracker.model.Incident;
import com.incidenttracker.model.Severity;
import com.incidenttracker.model.Status;

import java.time.Instant;
import java.util.UUID;

public class IncidentResponse {

    private UUID id;
    private String title;
    private String service;
    private Severity severity;
    private Status status;
    private String owner;
    private String summary;
    private Instant createdAt;
    private Instant updatedAt;

    public static IncidentResponse from(Incident incident) {
        IncidentResponse r = new IncidentResponse();
        r.id = incident.getId();
        r.title = incident.getTitle();
        r.service = incident.getService();
        r.severity = incident.getSeverity();
        r.status = incident.getStatus();
        r.owner = incident.getOwner();
        r.summary = incident.getSummary();
        r.createdAt = incident.getCreatedAt();
        r.updatedAt = incident.getUpdatedAt();
        return r;
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getService() { return service; }
    public Severity getSeverity() { return severity; }
    public Status getStatus() { return status; }
    public String getOwner() { return owner; }
    public String getSummary() { return summary; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
