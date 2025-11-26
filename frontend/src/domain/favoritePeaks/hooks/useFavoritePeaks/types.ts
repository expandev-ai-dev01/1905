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
  remove: (idFavoritePeak: number) => Promise<{ success: boolean }>;
  updatePosition: (params: {
    idFavoritePeak: number;
    dto: UpdatePositionDto;
  }) => Promise<{ success: boolean }>;
  checkExists: (peakId: string) => Promise<{ isFavorite: boolean }>;
  isCreating: boolean;
  isRemoving: boolean;
  isUpdatingPosition: boolean;
}
