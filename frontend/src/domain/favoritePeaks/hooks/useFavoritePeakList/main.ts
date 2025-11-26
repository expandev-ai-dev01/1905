import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritePeakService } from '../../services/favoritePeakService';
import type { UseFavoritePeakListReturn } from './types';

export const useFavoritePeakList = (): UseFavoritePeakListReturn => {
  const queryClient = useQueryClient();
  const queryKey = ['favoritePeaks'];

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () => favoritePeakService.list(),
  });

  const { mutateAsync: addFavorite } = useMutation({
    mutationFn: ({ peakId, userType }: { peakId: string; userType: 'gratuito' | 'premium' }) =>
      favoritePeakService.create({ peakId, userType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const { mutateAsync: removeFavorite } = useMutation({
    mutationFn: (idFavoritePeak: number) => favoritePeakService.delete(idFavoritePeak),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const { mutateAsync: updatePosition } = useMutation({
    mutationFn: ({
      idFavoritePeak,
      newPosition,
    }: {
      idFavoritePeak: number;
      newPosition: number;
    }) => favoritePeakService.updatePosition(idFavoritePeak, { newPosition }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    addFavorite: async (peakId: string, userType: 'gratuito' | 'premium') => {
      await addFavorite({ peakId, userType });
    },
    removeFavorite: async (idFavoritePeak: number) => {
      await removeFavorite(idFavoritePeak);
    },
    updatePosition: async (idFavoritePeak: number, newPosition: number) => {
      await updatePosition({ idFavoritePeak, newPosition });
    },
  };
};
