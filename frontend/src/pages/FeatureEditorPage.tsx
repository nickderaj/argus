import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFeature, useSaveFeature } from '../hooks/useFeatures';
import { exportFeature } from '../api/client';
import type { Feature, Scenario, ScenarioStep, CanonicalKeyword } from '../types';
import { getDisplayKeywords } from '../types';
import ScenarioPanel from '../components/scenario/ScenarioPanel';
import GherkinPreview from '../components/preview/GherkinPreview';
import './FeatureEditorPage.css';

function emptyFeature(): Feature {
  return {
    name: '',
    description: '',
    tags: '',
    scenarios: [],
  };
}

function newScenario(sortOrder: number): Scenario {
  return {
    clientId: crypto.randomUUID(),
    name: '',
    sortOrder,
    steps: [],
  };
}

/**
 * When loading from API, steps come with display keywords (And/But).
 * Convert them back to canonical keywords.
 */
function toCanonicalSteps(steps: { keyword: string; text: string; sortOrder: number; clientId?: string; stepDefinitionId?: number }[]): ScenarioStep[] {
  let lastCanonical: CanonicalKeyword = 'Given';
  return steps.map((st) => {
    let canonical: CanonicalKeyword;
    if (st.keyword === 'And' || st.keyword === 'But') {
      canonical = lastCanonical;
    } else {
      canonical = st.keyword as CanonicalKeyword;
    }
    lastCanonical = canonical;
    return {
      clientId: st.clientId || crypto.randomUUID(),
      keyword: canonical,
      text: st.text,
      sortOrder: st.sortOrder,
      stepDefinitionId: st.stepDefinitionId,
    };
  });
}

/**
 * Before saving, convert canonical keywords to display keywords for the API.
 */
function toSavePayload(feature: Feature): Feature {
  return {
    ...feature,
    scenarios: feature.scenarios.map((s) => {
      const displayKeywords = getDisplayKeywords(s.steps);
      return {
        ...s,
        steps: s.steps.map((step, i) => ({
          ...step,
          keyword: displayKeywords[i] as CanonicalKeyword,
        })),
      };
    }),
  };
}

export default function FeatureEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new' || id === undefined;
  const featureId = isNew ? undefined : Number(id);

  const { data: loadedFeature } = useFeature(featureId);
  const saveMutation = useSaveFeature();

  const [feature, setFeature] = useState<Feature>(emptyFeature());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isNew) {
      setFeature(emptyFeature());
      setLoaded(true);
    } else if (loadedFeature) {
      setFeature({
        ...loadedFeature,
        scenarios: loadedFeature.scenarios.map((s: Scenario) => ({
          ...s,
          clientId: s.clientId || crypto.randomUUID(),
          steps: toCanonicalSteps(s.steps),
        })),
      });
      setLoaded(true);
    }
  }, [isNew, loadedFeature]);

  const handleSave = () => {
    saveMutation.mutate(toSavePayload(feature), {
      onSuccess: (saved) => {
        if (isNew) {
          navigate(`/features/${saved.id}`, { replace: true });
        }
      },
    });
  };

  const handleExport = async () => {
    if (!feature.id) return;
    const text = await exportFeature(feature.id);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${feature.name || 'feature'}.feature`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateScenario = (index: number, updated: Scenario) => {
    const scenarios = [...feature.scenarios];
    scenarios[index] = updated;
    setFeature({ ...feature, scenarios });
  };

  const deleteScenario = (index: number) => {
    const scenarios = feature.scenarios.filter((_, i) => i !== index);
    setFeature({
      ...feature,
      scenarios: scenarios.map((s, i) => ({ ...s, sortOrder: i })),
    });
  };

  const addScenario = () => {
    setFeature({
      ...feature,
      scenarios: [...feature.scenarios, newScenario(feature.scenarios.length)],
    });
  };

  if (!loaded && !isNew) {
    return <div className="editor-loading">Loading...</div>;
  }

  return (
    <div className="feature-editor">
      <div className="editor-form">
        <div className="form-row">
          <label>Feature Name</label>
          <input
            type="text"
            value={feature.name}
            onChange={(e) => setFeature({ ...feature, name: e.target.value })}
            placeholder="Feature name"
            className="input-field"
          />
        </div>
        <div className="form-row">
          <label>Description</label>
          <textarea
            value={feature.description}
            onChange={(e) =>
              setFeature({ ...feature, description: e.target.value })
            }
            placeholder="Feature description"
            className="input-field textarea"
            rows={2}
          />
        </div>
        <div className="form-row">
          <label>Tags</label>
          <input
            type="text"
            value={feature.tags}
            onChange={(e) => setFeature({ ...feature, tags: e.target.value })}
            placeholder="@tag1 @tag2"
            className="input-field"
          />
        </div>
      </div>

      <div className="scenarios-section">
        <h3>Scenarios</h3>
        {feature.scenarios.map((scenario, index) => (
          <ScenarioPanel
            key={scenario.clientId}
            scenario={scenario}
            onChange={(updated) => updateScenario(index, updated)}
            onDelete={() => deleteScenario(index)}
          />
        ))}
        <button className="btn-add-scenario" onClick={addScenario}>
          + Add Scenario
        </button>
      </div>

      <GherkinPreview feature={feature} />

      <div className="editor-actions">
        <button
          className="btn-save"
          onClick={handleSave}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? 'Saving...' : 'Save Feature'}
        </button>
        {feature.id && (
          <button className="btn-export" onClick={handleExport}>
            Export .feature
          </button>
        )}
      </div>
    </div>
  );
}
