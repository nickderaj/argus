import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import type { ScenarioStep, CanonicalKeyword } from '../../types';
import { getDisplayKeywords } from '../../types';
import StepRow from './StepRow';
import StepPalette from './StepPalette';
import StepTypeChip, { getStepColor } from './StepTypeChip';
import './StepDropZone.css';

interface Props {
  steps: ScenarioStep[];
  onStepsChange: (steps: ScenarioStep[]) => void;
}

export default function StepDropZone({ steps, onStepsChange }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const { setNodeRef, isOver } = useDroppable({ id: 'step-drop-zone' });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    // Drag from palette - create new step
    const paletteData = active.data.current;
    if (paletteData?.type === 'new-step') {
      const newStep: ScenarioStep = {
        clientId: crypto.randomUUID(),
        keyword: paletteData.keyword as CanonicalKeyword,
        text: '',
        sortOrder: steps.length,
      };
      onStepsChange([...steps, newStep].map((s, i) => ({ ...s, sortOrder: i })));
      return;
    }

    // Reorder within zone
    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex((s) => s.clientId === active.id);
      const newIndex = steps.findIndex((s) => s.clientId === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = [...steps];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);
        onStepsChange(reordered.map((s, i) => ({ ...s, sortOrder: i })));
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleUpdateStep = (index: number, updated: ScenarioStep) => {
    const newSteps = [...steps];
    newSteps[index] = updated;
    onStepsChange(newSteps);
  };

  const handleDeleteStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    onStepsChange(newSteps.map((s, i) => ({ ...s, sortOrder: i })));
  };

  // Determine what's being dragged for the overlay
  const activeStep = steps.find((s) => s.clientId === activeId);
  const activePaletteKeyword = activeId?.startsWith('palette-')
    ? (activeId.replace('palette-', '') as CanonicalKeyword)
    : null;

  const displayKeywords = getDisplayKeywords(steps);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <StepPalette />
      <div
        ref={setNodeRef}
        className={`step-drop-zone ${isOver ? 'drop-over' : ''} ${
          steps.length === 0 ? 'empty' : ''
        }`}
      >
        {steps.length === 0 && (
          <p className="drop-hint">Drag step types here to build your scenario</p>
        )}
        <SortableContext
          items={steps.map((s) => s.clientId)}
          strategy={verticalListSortingStrategy}
        >
          {steps.map((step, index) => (
            <StepRow
              key={step.clientId}
              step={step}
              displayKeyword={displayKeywords[index]}
              onUpdate={(updated) => handleUpdateStep(index, updated)}
              onDelete={() => handleDeleteStep(index)}
            />
          ))}
        </SortableContext>
      </div>

      <DragOverlay dropAnimation={null}>
        {activePaletteKeyword && (
          <div className="drag-overlay-chip">
            <StepTypeChip keyword={activePaletteKeyword} />
            <span className="drag-overlay-text">Drop into scenario</span>
          </div>
        )}
        {activeStep && (
          <div className="drag-overlay-row">
            <StepTypeChip
              keyword={activeStep.keyword}
              color={getStepColor(activeStep.keyword)}
            />
            <span className="drag-overlay-text">
              {activeStep.text || '(empty step)'}
            </span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
