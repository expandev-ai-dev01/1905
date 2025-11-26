import { Star } from 'lucide-react';
import { Button } from '@/core/components/button';
import { cn } from '@/core/lib/utils';
import { useFavoritePeakCheck } from '../../hooks/useFavoritePeakCheck';
import { useFavoritePeakList } from '../../hooks/useFavoritePeakList';
import type { FavoriteButtonProps } from './types';

function FavoriteButton({ peakId, userType, className, onFavoriteChange }: FavoriteButtonProps) {
  const { isFavorite, isLoading: checkLoading } = useFavoritePeakCheck(peakId);
  const { data: favorites, addFavorite, removeFavorite } = useFavoritePeakList();

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        const favoritePeak = favorites?.find((fav) => fav.peakId === peakId);
        if (favoritePeak) {
          await removeFavorite(favoritePeak.idFavoritePeak);
          onFavoriteChange?.(false);
        }
      } else {
        await addFavorite(peakId, userType);
        onFavoriteChange?.(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleFavorite}
      disabled={checkLoading}
      className={cn('transition-all duration-200', className)}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star
        className={cn(
          'h-5 w-5 transition-all duration-200',
          isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'
        )}
      />
    </Button>
  );
}

export { FavoriteButton };
