package com.argus.service;

import com.argus.entity.Feature;
import com.argus.entity.Scenario;
import com.argus.entity.ScenarioStep;
import org.springframework.stereotype.Service;

@Service
public class GherkinExportService {

    public String export(Feature feature) {
        StringBuilder sb = new StringBuilder();

        if (feature.getTags() != null && !feature.getTags().isBlank()) {
            sb.append(feature.getTags()).append("\n");
        }

        sb.append("Feature: ").append(feature.getName()).append("\n");

        if (feature.getDescription() != null && !feature.getDescription().isBlank()) {
            for (String line : feature.getDescription().split("\n")) {
                sb.append("  ").append(line.trim()).append("\n");
            }
        }

        for (Scenario scenario : feature.getScenarios()) {
            sb.append("\n");
            sb.append("  Scenario: ").append(scenario.getName()).append("\n");

            for (ScenarioStep step : scenario.getSteps()) {
                sb.append("    ")
                   .append(step.getKeywordOverride())
                   .append(" ")
                   .append(step.getStepDefinition().getText())
                   .append("\n");
            }
        }

        return sb.toString();
    }
}
