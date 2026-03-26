package com.argus.service;

import com.argus.dto.FeatureDto;
import com.argus.dto.ScenarioDto;
import com.argus.dto.StepDto;
import com.argus.entity.*;
import com.argus.repository.FeatureRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeatureService {

    private final FeatureRepository featureRepository;
    private final StepService stepService;

    public List<Feature> findAll() {
        return featureRepository.findAll();
    }

    public Feature findById(Long id) {
        return featureRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Feature not found: " + id));
    }

    @Transactional
    public Feature create(FeatureDto dto) {
        Feature feature = Feature.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .tags(dto.getTags())
                .build();

        if (dto.getScenarios() != null) {
            for (ScenarioDto scenarioDto : dto.getScenarios()) {
                Scenario scenario = buildScenario(scenarioDto, feature);
                feature.getScenarios().add(scenario);
            }
        }

        return featureRepository.save(feature);
    }

    @Transactional
    public Feature update(Long id, FeatureDto dto) {
        Feature feature = findById(id);
        feature.setName(dto.getName());
        feature.setDescription(dto.getDescription());
        feature.setTags(dto.getTags());

        // Clear and rebuild scenarios (full replace)
        feature.getScenarios().clear();

        if (dto.getScenarios() != null) {
            for (ScenarioDto scenarioDto : dto.getScenarios()) {
                Scenario scenario = buildScenario(scenarioDto, feature);
                feature.getScenarios().add(scenario);
            }
        }

        return featureRepository.save(feature);
    }

    @Transactional
    public void delete(Long id) {
        if (!featureRepository.existsById(id)) {
            throw new EntityNotFoundException("Feature not found: " + id);
        }
        featureRepository.deleteById(id);
    }

    private Scenario buildScenario(ScenarioDto dto, Feature feature) {
        Scenario scenario = Scenario.builder()
                .feature(feature)
                .name(dto.getName())
                .sortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0)
                .build();

        if (dto.getSteps() != null) {
            String lastCanonicalKeyword = null;
            for (StepDto stepDto : dto.getSteps()) {
                String canonicalKeyword = stepService.resolveCanonicalKeyword(
                        stepDto.getKeyword(), lastCanonicalKeyword);
                lastCanonicalKeyword = canonicalKeyword;

                StepDefinition stepDef = stepService.findOrCreate(canonicalKeyword, stepDto.getText());

                ScenarioStep step = ScenarioStep.builder()
                        .scenario(scenario)
                        .stepDefinition(stepDef)
                        .keywordOverride(stepDto.getKeyword())
                        .sortOrder(stepDto.getSortOrder() != null ? stepDto.getSortOrder() : 0)
                        .build();

                scenario.getSteps().add(step);
            }
        }

        return scenario;
    }
}
