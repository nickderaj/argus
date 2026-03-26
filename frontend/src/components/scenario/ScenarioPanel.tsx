import type { Scenario } from '../../types';
import StepDropZone from '../step/StepDropZone';
import './ScenarioPanel.css';

interface Props {
  scenario: Scenario;
  onChange: (scenario: Scenario) => void;
  onDelete: () => void;
}

export default function ScenarioPanel({ scenario, onChange, onDelete }: Props) {
  return (
    <div className="scenario-panel">
      <div className="scenario-header">
        <label className="scenario-label">Scenario:</label>
        <input
          type="text"
          className="scenario-name-input"
          value={scenario.name}
          onChange={(e) => onChange({ ...scenario, name: e.target.value })}
          placeholder="Scenario name"
        />
        <button className="btn-delete-scenario" onClick={onDelete} title="Remove scenario">
          &times;
        </button>
      </div>
      <StepDropZone
        steps={scenario.steps}
        onStepsChange={(steps) => onChange({ ...scenario, steps })}
      />
    </div>
  );
}
