import type { StepKeyword, CanonicalKeyword } from '../../types';
import './StepTypeChip.css';

const KEYWORD_COLORS: Record<CanonicalKeyword, string> = {
  Given: '#a6e3a1',
  When: '#89b4fa',
  Then: '#fab387',
};

interface Props {
  keyword: StepKeyword;
  color?: string;
  draggable?: boolean;
}

export function getStepColor(canonicalKeyword: CanonicalKeyword): string {
  return KEYWORD_COLORS[canonicalKeyword];
}

export default function StepTypeChip({ keyword, color, draggable }: Props) {
  const bg = color ?? KEYWORD_COLORS[keyword as CanonicalKeyword] ?? '#9ca0b0';

  return (
    <span
      className={`step-chip ${draggable ? 'step-chip-draggable' : ''}`}
      style={{ backgroundColor: bg, color: '#1e1e2e' }}
    >
      {keyword}
    </span>
  );
}
