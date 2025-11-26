import { useQuery } from '@tanstack/react-query';
import { favoritePeakService } from '../../services';
import type { UseCheckFavoriteOptions, UseCheckFavoriteReturn } from './types';

export const useCheckFavorite = (options: UseCheckFavoriteOptions): UseCheckFavoriteReturn => {
  const { data, isLoading } = useQuery({
    queryKey: ['checkFavorite', options.peakId],
    queryFn: () => favoritePeakService.checkExists(options.peakId),
    enabled: !!options.peakId && (options.enabled ?? true),
  });

  return {
    isFavorite: data?.isFavorite ?? false,
    isLoading,
  };
};
