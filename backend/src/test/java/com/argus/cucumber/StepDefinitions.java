package com.argus.cucumber;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.And;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class StepDefinitions extends SpringIntegrationConfig {

    @Autowired
    private TestRestTemplate restTemplate;

    private ResponseEntity<Map> featureResponse;
    private ResponseEntity<List> searchResponse;
    private ResponseEntity<String> exportResponse;
    private Long createdFeatureId;

    @Given("the API is running")
    public void theApiIsRunning() {
        // Spring Boot test context handles this
    }

    @When("I create a feature with name {string} and description {string}")
    public void iCreateAFeature(String name, String description) {
        Map<String, Object> body = new HashMap<>();
        body.put("name", name);
        body.put("description", description);
        body.put("tags", "");
        body.put("scenarios", new ArrayList<>());

        featureResponse = restTemplate.postForEntity("/api/features", body, Map.class);
        if (featureResponse.getStatusCode() == HttpStatus.CREATED) {
            createdFeatureId = ((Number) featureResponse.getBody().get("id")).longValue();
        }
    }

    @And("I add a scenario {string} with steps:")
    public void iAddAScenarioWithSteps(String scenarioName, DataTable dataTable) {
        List<Map<String, String>> rows = dataTable.asMaps();
        List<Map<String, Object>> steps = new ArrayList<>();
        for (int i = 0; i < rows.size(); i++) {
            Map<String, Object> step = new HashMap<>();
            step.put("keyword", rows.get(i).get("keyword"));
            step.put("text", rows.get(i).get("text"));
            step.put("sortOrder", i);
            steps.add(step);
        }

        Map<String, Object> scenario = new HashMap<>();
        scenario.put("name", scenarioName);
        scenario.put("sortOrder", 0);
        scenario.put("steps", steps);

        Map<String, Object> body = new HashMap<>();
        body.put("name", featureResponse.getBody().get("name"));
        body.put("description", featureResponse.getBody().get("description"));
        body.put("tags", "");
        body.put("scenarios", List.of(scenario));

        restTemplate.put("/api/features/" + createdFeatureId, body);

        featureResponse = restTemplate.getForEntity("/api/features/" + createdFeatureId, Map.class);
    }

    @Then("the feature should be saved successfully")
    public void theFeatureShouldBeSaved() {
        assertEquals(HttpStatus.OK, featureResponse.getStatusCode());
        assertNotNull(featureResponse.getBody().get("id"));
    }

    @And("the feature should have {int} scenario")
    public void theFeatureShouldHaveScenarios(int count) {
        List scenarios = (List) featureResponse.getBody().get("scenarios");
        assertEquals(count, scenarios.size());
    }

    @And("the scenario should have {int} steps")
    public void theScenarioShouldHaveSteps(int count) {
        List scenarios = (List) featureResponse.getBody().get("scenarios");
        Map scenario = (Map) scenarios.get(0);
        List steps = (List) scenario.get("steps");
        assertEquals(count, steps.size());
    }

    @Given("a step definition exists with keyword {string} and text {string}")
    public void aStepDefinitionExists(String keyword, String text) {
        // Create a feature with this step to ensure it exists
        Map<String, Object> step = new HashMap<>();
        step.put("keyword", keyword);
        step.put("text", text);
        step.put("sortOrder", 0);

        Map<String, Object> scenario = new HashMap<>();
        scenario.put("name", "Setup scenario");
        scenario.put("sortOrder", 0);
        scenario.put("steps", List.of(step));

        Map<String, Object> body = new HashMap<>();
        body.put("name", "Setup Feature");
        body.put("description", "");
        body.put("tags", "");
        body.put("scenarios", List.of(scenario));

        restTemplate.postForEntity("/api/features", body, Map.class);
    }

    @When("I search for steps with query {string}")
    public void iSearchForSteps(String query) {
        searchResponse = restTemplate.getForEntity("/api/steps/search?q=" + query, List.class);
    }

    @Then("the search results should contain {string}")
    public void theSearchResultsShouldContain(String text) {
        assertEquals(HttpStatus.OK, searchResponse.getStatusCode());
        List<Map<String, Object>> results = searchResponse.getBody();
        assertTrue(results.stream().anyMatch(r -> text.equals(r.get("text"))),
                "Expected to find step with text: " + text);
    }

    @Given("a feature {string} exists with scenarios and steps")
    public void aFeatureExistsWithScenariosAndSteps(String name) {
        Map<String, Object> step = new HashMap<>();
        step.put("keyword", "Given");
        step.put("text", "a precondition");
        step.put("sortOrder", 0);

        Map<String, Object> scenario = new HashMap<>();
        scenario.put("name", "Test scenario");
        scenario.put("sortOrder", 0);
        scenario.put("steps", List.of(step));

        Map<String, Object> body = new HashMap<>();
        body.put("name", name);
        body.put("description", "Test description");
        body.put("tags", "");
        body.put("scenarios", List.of(scenario));

        ResponseEntity<Map> response = restTemplate.postForEntity("/api/features", body, Map.class);
        createdFeatureId = ((Number) response.getBody().get("id")).longValue();
    }

    @When("I export the feature as Gherkin text")
    public void iExportTheFeature() {
        exportResponse = restTemplate.getForEntity("/api/features/" + createdFeatureId + "/export", String.class);
    }

    @Then("the export should contain {string}")
    public void theExportShouldContain(String text) {
        assertEquals(HttpStatus.OK, exportResponse.getStatusCode());
        assertTrue(exportResponse.getBody().contains(text),
                "Expected export to contain: " + text);
    }
}
