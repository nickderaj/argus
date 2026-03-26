import axios from 'axios';
import type { Feature, FeatureSummary, StepDefinitionResult } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
});

export const fetchFeatures = (): Promise<FeatureSummary[]> =>
  api.get('/features').then((r) => r.data);

export const fetchFeature = (id: number): Promise<Feature> =>
  api.get(`/features/${id}`).then((r) => r.data);

export const saveFeature = (feature: Feature): Promise<Feature> =>
  feature.id
    ? api.put(`/features/${feature.id}`, feature).then((r) => r.data)
    : api.post('/features', feature).then((r) => r.data);

export const deleteFeature = (id: number): Promise<void> =>
  api.delete(`/features/${id}`);

export const searchSteps = (
  q: string,
  keyword?: string
): Promise<StepDefinitionResult[]> =>
  api.get('/steps/search', { params: { q, keyword } }).then((r) => r.data);

export const exportFeature = (id: number): Promise<string> =>
  api.get(`/features/${id}/export`, { responseType: 'text' }).then((r) => r.data);
