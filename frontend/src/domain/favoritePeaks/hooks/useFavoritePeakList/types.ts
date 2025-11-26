import type { FavoritePeak } from '../../types';

export interface UseFavoritePeakListReturn {
  data: FavoritePeak[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  addFavorite: (peakId: string, userType: 'gratuito' | 'premium') => Promise<void>;
  removeFavorite: (idFavoritePeak: number) => Promise<void>;
  updatePosition: (idFavoritePeak: number, newPosition: number) => Promise<void>;
}
