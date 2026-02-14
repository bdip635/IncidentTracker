package com.incidenttracker.controller;

import com.incidenttracker.dto.*;
import com.incidenttracker.model.Severity;
import com.incidenttracker.model.Status;
import com.incidenttracker.service.IncidentService;
import com.incidenttracker.service.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "http://localhost:5173")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @PostMapping
    public ResponseEntity<IncidentResponse> create(@Valid @RequestBody IncidentRequest request) {
        IncidentResponse created = incidentService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<PageResponse<IncidentResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Severity severity,
            @RequestParam(required = false) String service,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        Sort order = parseSort(sort);
        Pageable pageable = PageRequest.of(page, size, order);
        PageResponse<IncidentResponse> result = incidentService.findAll(search, status, severity, service, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/services")
    public ResponseEntity<List<String>> getServices() {
        return ResponseEntity.ok(incidentService.getDistinctServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponse> getById(@PathVariable UUID id) {
        IncidentResponse incident = incidentService.findById(id);
        return ResponseEntity.ok(incident);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<IncidentResponse> update(@PathVariable UUID id, @Valid @RequestBody IncidentUpdateRequest request) {
        IncidentResponse updated = incidentService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiError(ex.getMessage()));
    }

    private Sort parseSort(String sortParam) {
        if (sortParam == null || sortParam.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }
        String[] parts = sortParam.split(",");
        String property = parts[0].trim();
        Sort.Direction direction = parts.length > 1 && "asc".equalsIgnoreCase(parts[1].trim())
            ? Sort.Direction.ASC
            : Sort.Direction.DESC;
        return Sort.by(direction, property);
    }

    public record ApiError(String message) {}
}
