package com.incidenttracker.dto;

import com.incidenttracker.model.Severity;
import com.incidenttracker.model.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class IncidentUpdateRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Service is required")
    private String service;

    @NotNull(message = "Severity is required")
    private Severity severity;

    @NotNull(message = "Status is required")
    private Status status;

    private String owner;

    private String summary;

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
}
