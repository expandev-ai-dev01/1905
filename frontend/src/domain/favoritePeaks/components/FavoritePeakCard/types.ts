import type { FavoritePeakPreview } from '../../types';

export interface FavoritePeakCardProps {
  favoritePeak: FavoritePeakPreview;
  onRemove: (idFavoritePeak: number) => void;
  onViewDetails: (peakId: string) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}
