import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchSteps } from '../api/client';

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function useStepAutocomplete(keyword?: string) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { data: suggestions } = useQuery({
    queryKey: ['steps', 'search', keyword, debouncedQuery],
    queryFn: () => searchSteps(debouncedQuery, keyword),
    enabled: debouncedQuery.length >= 2,
  });

  return { query, setQuery, suggestions: suggestions ?? [] };
}
