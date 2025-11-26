import type { FavoritePeak } from '../../types';

export interface FavoritePeakCardProps {
  favoritePeak: FavoritePeak;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  isRemoving: boolean;
  className?: string;
}
