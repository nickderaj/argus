import { useState, useRef, useEffect } from 'react';
import { useStepAutocomplete } from '../../hooks/useStepAutocomplete';
import './StepAutocomplete.css';

interface Props {
  value: string;
  keyword?: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

export default function StepAutocomplete({
  value,
  keyword,
  onChange,
  placeholder = 'Type step text...',
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const { query, setQuery, suggestions } = useStepAutocomplete(keyword);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value, setQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showDropdown =
    isFocused && suggestions.length > 0 && query.length >= 2;

  return (
    <div className="step-autocomplete" ref={wrapperRef}>
      <input
        type="text"
        className="step-autocomplete-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
      />
      {showDropdown && (
        <ul className="step-autocomplete-dropdown">
          {suggestions.map((s) => (
            <li
              key={s.id}
              className="step-autocomplete-option"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(s.text);
                setIsFocused(false);
              }}
            >
              <span className="option-keyword">{s.keyword}</span>
              <span className="option-text">{s.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
