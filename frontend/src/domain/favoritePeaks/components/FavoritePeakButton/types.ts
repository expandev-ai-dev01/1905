export interface FavoritePeakButtonProps {
  peakId: string;
  userType: 'gratuito' | 'premium';
  isFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
  className?: string;
}
