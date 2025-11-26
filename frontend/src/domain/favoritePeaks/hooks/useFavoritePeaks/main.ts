import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritePeakService } from '../../services';
import type { FavoritePeakCreateDto, FavoritePeakUpdatePositionDto } from '../../types';

export const useFavoritePeaks = () => {
  const queryClient = useQueryClient();
  const queryKey = ['favoritePeaks'];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => favoritePeakService.list(),
  });

  const { mutateAsync: create, isPending: isCreating } = useMutation({
    mutationFn: (dto: FavoritePeakCreateDto) => favoritePeakService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const { mutateAsync: remove, isPending: isRemoving } = useMutation({
    mutationFn: (idFavoritePeak: number) => favoritePeakService.delete(idFavoritePeak),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const { mutateAsync: updatePosition, isPending: isUpdatingPosition } = useMutation({
    mutationFn: ({
      idFavoritePeak,
      dto,
    }: {
      idFavoritePeak: number;
      dto: FavoritePeakUpdatePositionDto;
    }) => favoritePeakService.updatePosition(idFavoritePeak, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    favoritePeaks: data ?? [],
    isLoading,
    error,
    refetch,
    create,
    isCreating,
    remove,
    isRemoving,
    updatePosition,
    isUpdatingPosition,
  };
};
