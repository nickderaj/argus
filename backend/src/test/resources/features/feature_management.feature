Feature: Feature Management API
  As a user of Argus
  I want to manage Gherkin features via the API
  So that I can create and reuse test scenarios

  Scenario: Create a new feature with scenarios and steps
    Given the API is running
    When I create a feature with name "User Login" and description "Login flows"
    And I add a scenario "Successful login" with steps:
      | keyword | text                              |
      | Given   | the user is on the login page     |
      | When    | the user enters valid credentials |
      | Then    | the user should see the dashboard |
    Then the feature should be saved successfully
    And the feature should have 1 scenario
    And the scenario should have 3 steps

  Scenario: Search for existing steps
    Given a step definition exists with keyword "Given" and text "the user is on the login page"
    When I search for steps with query "login page"
    Then the search results should contain "the user is on the login page"

  Scenario: Export feature as Gherkin text
    Given a feature "User Login" exists with scenarios and steps
    When I export the feature as Gherkin text
    Then the export should contain "Feature: User Login"
    And the export should contain "Scenario:"
    And the export should contain "Given"
