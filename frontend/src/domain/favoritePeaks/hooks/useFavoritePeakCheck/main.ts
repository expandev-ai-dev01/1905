import { useQuery } from '@tanstack/react-query';
import { favoritePeakService } from '../../services';

export const useFavoritePeakCheck = (peakId: string | undefined) => {
  const { data, isLoading } = useQuery({
    queryKey: ['favoritePeakCheck', peakId],
    queryFn: () => favoritePeakService.check(peakId!),
    enabled: !!peakId,
  });

  return {
    isFavorite: data?.isFavorite ?? false,
    isLoading,
  };
};
