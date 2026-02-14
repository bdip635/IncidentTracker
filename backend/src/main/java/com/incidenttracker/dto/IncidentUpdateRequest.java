package com.incidenttracker.dto;

import com.incidenttracker.model.Severity;
import com.incidenttracker.model.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
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
}
