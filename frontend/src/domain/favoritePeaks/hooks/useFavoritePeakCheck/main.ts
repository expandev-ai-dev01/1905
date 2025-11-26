import { useQuery } from '@tanstack/react-query';
import { favoritePeakService } from '../../services/favoritePeakService';
import type { UseFavoritePeakCheckReturn } from './types';

export const useFavoritePeakCheck = (peakId: string): UseFavoritePeakCheckReturn => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['favoritePeakCheck', peakId],
    queryFn: () => favoritePeakService.checkExists(peakId),
    enabled: !!peakId,
  });

  return {
    isFavorite: data?.isFavorite,
    isLoading,
    isError,
    error,
    refetch,
  };
};
