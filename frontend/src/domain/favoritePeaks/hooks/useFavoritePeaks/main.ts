import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritePeakService } from '../../services';
import type { CreateFavoritePeakDto, UpdatePositionDto } from '../../types';
import type { UseFavoritePeaksOptions, UseFavoritePeaksReturn } from './types';

export const useFavoritePeaks = (options?: UseFavoritePeaksOptions): UseFavoritePeaksReturn => {
  const queryClient = useQueryClient();
  const queryKey = ['favoritePeaks'];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => favoritePeakService.list(),
    enabled: options?.enabled ?? true,
  });

  const { mutateAsync: create, isPending: isCreating } = useMutation({
    mutationFn: (dto: CreateFavoritePeakDto) => favoritePeakService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const { mutateAsync: remove, isPending: isRemoving } = useMutation({
    mutationFn: (id: number) => favoritePeakService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const { mutateAsync: updatePosition, isPending: isUpdatingPosition } = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdatePositionDto }) =>
      favoritePeakService.updatePosition(id, dto),
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
    remove,
    updatePosition,
    isCreating,
    isRemoving,
    isUpdatingPosition,
  };
};
