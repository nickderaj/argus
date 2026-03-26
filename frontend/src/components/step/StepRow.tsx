import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ScenarioStep, StepKeyword } from '../../types';
import StepTypeChip, { getStepColor } from './StepTypeChip';
import StepAutocomplete from './StepAutocomplete';
import './StepRow.css';

interface Props {
  step: ScenarioStep;
  displayKeyword: StepKeyword;
  onUpdate: (step: ScenarioStep) => void;
  onDelete: () => void;
}

export default function StepRow({ step, displayKeyword, onUpdate, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.clientId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const color = getStepColor(step.keyword);

  return (
    <div ref={setNodeRef} style={style} className="step-row" {...attributes}>
      <span className="step-drag-handle" {...listeners}>
        &#x2630;
      </span>
      <StepTypeChip keyword={displayKeyword} color={color} />
      <StepAutocomplete
        value={step.text}
        keyword={step.keyword}
        onChange={(text) => onUpdate({ ...step, text })}
      />
      <button className="btn-delete-step" onClick={onDelete} title="Remove step">
        &times;
      </button>
    </div>
  );
}
