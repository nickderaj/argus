import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFeatures, fetchFeature, saveFeature, deleteFeature } from '../api/client';

export function useFeatureList() {
  return useQuery({
    queryKey: ['features'],
    queryFn: fetchFeatures,
  });
}

export function useFeature(id: number | undefined) {
  return useQuery({
    queryKey: ['feature', id],
    queryFn: () => fetchFeature(id!),
    enabled: id !== undefined,
  });
}

export function useSaveFeature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
    },
  });
}

export function useDeleteFeature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
    },
  });
}
