import type { FavoritePeak, CreateFavoritePeakDto, UpdatePositionDto } from '../../types';

export interface UseFavoritePeaksOptions {
  enabled?: boolean;
}

export interface UseFavoritePeaksReturn {
  favoritePeaks: FavoritePeak[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  create: (dto: CreateFavoritePeakDto) => Promise<{ idFavoritePeak: number }>;
  remove: (id: number) => Promise<{ success: boolean }>;
  updatePosition: (params: { id: number; dto: UpdatePositionDto }) => Promise<{ success: boolean }>;
  isCreating: boolean;
  isRemoving: boolean;
  isUpdatingPosition: boolean;
}
