export interface UseFavoritePeakCheckReturn {
  isFavorite: boolean | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}
