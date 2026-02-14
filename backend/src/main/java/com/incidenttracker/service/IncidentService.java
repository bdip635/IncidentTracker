package com.incidenttracker.service;

import com.incidenttracker.dto.*;
import com.incidenttracker.model.Incident;
import com.incidenttracker.model.Severity;
import com.incidenttracker.model.Status;
import com.incidenttracker.repository.IncidentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<IncidentResponse> findAll(String search, Status status, Severity severity, String service, Pageable pageable) {
        String searchTrimmed = (search != null && !search.isBlank()) ? search.trim() : null;
        String serviceTrimmed = (service != null && !service.isBlank()) ? service.trim() : null;
        Page<Incident> page = incidentRepository.findAllFiltered(searchTrimmed, status, severity, serviceTrimmed, pageable);
        return PageResponse.of(page.map(IncidentResponse::from));
    }

    @Transactional(readOnly = true)
    public IncidentResponse findById(UUID id) {
        Incident incident = incidentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Incident not found: " + id));
        return IncidentResponse.from(incident);
    }

    @Transactional
    public IncidentResponse create(IncidentRequest request) {
        Incident incident = Incident.builder()
            .title(request.getTitle().trim())
            .service(request.getService().trim())
            .severity(request.getSeverity())
            .status(request.getStatus() != null ? request.getStatus() : Status.OPEN)
            .owner(request.getOwner() != null ? request.getOwner().trim() : null)
            .summary(request.getSummary() != null ? request.getSummary().trim() : null)
            .build();
        incident = incidentRepository.save(incident);
        return IncidentResponse.from(incident);
    }

    @Transactional
    public IncidentResponse update(UUID id, IncidentUpdateRequest request) {
        Incident incident = incidentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Incident not found: " + id));
        incident.setTitle(request.getTitle().trim());
        incident.setService(request.getService().trim());
        incident.setSeverity(request.getSeverity());
        incident.setStatus(request.getStatus());
        incident.setOwner(request.getOwner() != null ? request.getOwner().trim() : null);
        incident.setSummary(request.getSummary() != null ? request.getSummary().trim() : null);
        incident = incidentRepository.save(incident);
        return IncidentResponse.from(incident);
    }
}
