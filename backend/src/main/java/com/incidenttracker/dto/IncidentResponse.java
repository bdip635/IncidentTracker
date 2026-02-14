package com.incidenttracker.dto;

import com.incidenttracker.model.Incident;
import com.incidenttracker.model.Severity;
import com.incidenttracker.model.Status;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
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
        return IncidentResponse.builder()
            .id(incident.getId())
            .title(incident.getTitle())
            .service(incident.getService())
            .severity(incident.getSeverity())
            .status(incident.getStatus())
            .owner(incident.getOwner())
            .summary(incident.getSummary())
            .createdAt(incident.getCreatedAt())
            .updatedAt(incident.getUpdatedAt())
            .build();
    }
}
