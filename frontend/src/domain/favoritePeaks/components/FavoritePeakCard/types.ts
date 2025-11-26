import type { FavoritePeakPreview } from '../../types';

export interface FavoritePeakCardProps {
  peak: FavoritePeakPreview;
  onViewDetails: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isLoading?: boolean;
}
