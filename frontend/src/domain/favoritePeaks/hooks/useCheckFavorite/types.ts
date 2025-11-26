export interface UseCheckFavoriteOptions {
  peakId: string;
  enabled?: boolean;
}

export interface UseCheckFavoriteReturn {
  isFavorite: boolean;
  isLoading: boolean;
}
