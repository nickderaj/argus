export type StepKeyword = 'Given' | 'When' | 'Then' | 'And' | 'But';
export type CanonicalKeyword = 'Given' | 'When' | 'Then';

export interface StepDefinitionResult {
  id: number;
  keyword: CanonicalKeyword;
  text: string;
}

export interface ScenarioStep {
  clientId: string;
  keyword: CanonicalKeyword; // Always the canonical type - never "And"
  text: string;
  sortOrder: number;
  stepDefinitionId?: number;
}

export interface Scenario {
  id?: number;
  clientId: string;
  name: string;
  sortOrder: number;
  steps: ScenarioStep[];
}

export interface Feature {
  id?: number;
  name: string;
  description: string;
  tags: string;
  scenarios: Scenario[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FeatureSummary {
  id: number;
  name: string;
  tags: string;
  scenarioCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Compute the display keyword for each step based on position.
 * If the previous step has the same canonical keyword, display "And".
 */
export function getDisplayKeywords(steps: ScenarioStep[]): StepKeyword[] {
  return steps.map((step, i) => {
    if (i > 0 && steps[i - 1].keyword === step.keyword) {
      return 'And';
    }
    return step.keyword;
  });
}
