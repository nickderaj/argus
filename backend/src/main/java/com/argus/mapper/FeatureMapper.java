package com.argus.mapper;

import com.argus.dto.*;
import com.argus.entity.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class FeatureMapper {

    public FeatureSummaryDto toSummaryDto(Feature feature) {
        return FeatureSummaryDto.builder()
                .id(feature.getId())
                .name(feature.getName())
                .tags(feature.getTags())
                .scenarioCount(feature.getScenarios().size())
                .createdAt(feature.getCreatedAt())
                .updatedAt(feature.getUpdatedAt())
                .build();
    }

    public FeatureDto toDto(Feature feature) {
        return FeatureDto.builder()
                .id(feature.getId())
                .name(feature.getName())
                .description(feature.getDescription())
                .tags(feature.getTags())
                .scenarios(feature.getScenarios().stream()
                        .map(this::toScenarioDto)
                        .collect(Collectors.toList()))
                .createdAt(feature.getCreatedAt())
                .updatedAt(feature.getUpdatedAt())
                .build();
    }

    private ScenarioDto toScenarioDto(Scenario scenario) {
        return ScenarioDto.builder()
                .id(scenario.getId())
                .name(scenario.getName())
                .sortOrder(scenario.getSortOrder())
                .steps(scenario.getSteps().stream()
                        .map(this::toStepDto)
                        .collect(Collectors.toList()))
                .build();
    }

    private StepDto toStepDto(ScenarioStep step) {
        return StepDto.builder()
                .id(step.getId())
                .keyword(step.getKeywordOverride())
                .text(step.getStepDefinition().getText())
                .sortOrder(step.getSortOrder())
                .stepDefinitionId(step.getStepDefinition().getId())
                .build();
    }

    public StepDefinitionDto toStepDefinitionDto(StepDefinition sd) {
        return StepDefinitionDto.builder()
                .id(sd.getId())
                .keyword(sd.getKeyword())
                .text(sd.getText())
                .build();
    }
}
