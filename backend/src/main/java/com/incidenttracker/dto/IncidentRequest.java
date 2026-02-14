package com.incidenttracker.dto;

import com.incidenttracker.model.Severity;
import com.incidenttracker.model.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IncidentRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Service is required")
    private String service;

    @NotNull(message = "Severity is required")
    private Severity severity;

    private Status status; // optional on create; defaults to OPEN in service

    private String owner;

    private String summary;
}
