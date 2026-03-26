package com.argus.controller;

import com.argus.dto.FeatureDto;
import com.argus.dto.FeatureSummaryDto;
import com.argus.entity.Feature;
import com.argus.mapper.FeatureMapper;
import com.argus.service.FeatureService;
import com.argus.service.GherkinExportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/features")
@RequiredArgsConstructor
public class FeatureController {

    private final FeatureService featureService;
    private final GherkinExportService gherkinExportService;
    private final FeatureMapper featureMapper;

    @GetMapping
    public List<FeatureSummaryDto> listAll() {
        return featureService.findAll().stream()
                .map(featureMapper::toSummaryDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public FeatureDto getById(@PathVariable Long id) {
        return featureMapper.toDto(featureService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FeatureDto create(@Valid @RequestBody FeatureDto dto) {
        Feature feature = featureService.create(dto);
        return featureMapper.toDto(feature);
    }

    @PutMapping("/{id}")
    public FeatureDto update(@PathVariable Long id, @Valid @RequestBody FeatureDto dto) {
        Feature feature = featureService.update(id, dto);
        return featureMapper.toDto(feature);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        featureService.delete(id);
    }

    @GetMapping(value = "/{id}/export", produces = MediaType.TEXT_PLAIN_VALUE)
    public String export(@PathVariable Long id) {
        Feature feature = featureService.findById(id);
        return gherkinExportService.export(feature);
    }
}
