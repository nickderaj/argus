import type { Feature } from '../../types';
import { getDisplayKeywords } from '../../types';
import './GherkinPreview.css';

interface Props {
  feature: Feature;
}

export default function GherkinPreview({ feature }: Props) {
  const lines: string[] = [];

  if (feature.tags) {
    lines.push(feature.tags);
  }
  lines.push(`Feature: ${feature.name || '(unnamed)'}`);
  if (feature.description) {
    feature.description.split('\n').forEach((line) => {
      lines.push(`  ${line.trim()}`);
    });
  }

  for (const scenario of feature.scenarios) {
    lines.push('');
    lines.push(`  Scenario: ${scenario.name || '(unnamed)'}`);
    const displayKeywords = getDisplayKeywords(scenario.steps);
    for (let i = 0; i < scenario.steps.length; i++) {
      const step = scenario.steps[i];
      lines.push(`    ${displayKeywords[i]} ${step.text || '...'}`);
    }
  }

  const text = lines.join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="gherkin-preview">
      <div className="gherkin-preview-header">
        <h3>Gherkin Preview</h3>
        <button className="btn-copy" onClick={handleCopy}>
          Copy
        </button>
      </div>
      <pre className="gherkin-preview-content">{text}</pre>
    </div>
  );
}
