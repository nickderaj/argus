import { useDraggable } from '@dnd-kit/core';
import type { CanonicalKeyword } from '../../types';
import StepTypeChip from './StepTypeChip';
import './StepPalette.css';

const KEYWORDS: CanonicalKeyword[] = ['Given', 'When', 'Then'];

function PaletteTile({ keyword }: { keyword: CanonicalKeyword }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${keyword}`,
    data: { type: 'new-step', keyword },
  });

  return (
    <div
      ref={setNodeRef}
      className={`palette-tile ${isDragging ? 'dragging' : ''}`}
      {...listeners}
      {...attributes}
    >
      <StepTypeChip keyword={keyword} draggable />
    </div>
  );
}

export default function StepPalette() {
  return (
    <div className="step-palette">
      <span className="palette-label">Drag to add:</span>
      {KEYWORDS.map((kw) => (
        <PaletteTile key={kw} keyword={kw} />
      ))}
    </div>
  );
}
