export interface FavoriteButtonProps {
  peakId: string;
  userType: 'gratuito' | 'premium';
  className?: string;
  onFavoriteChange?: (isFavorite: boolean) => void;
}
