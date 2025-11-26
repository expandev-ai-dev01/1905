import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/core/components/button';
import { cn } from '@/core/lib/utils';
import { useFavoritePeakList } from '../../hooks';
import type { FavoritePeakButtonProps } from './types';

function FavoritePeakButton({
  peakId,
  userType,
  isFavorite: initialIsFavorite,
  onToggle,
  className,
}: FavoritePeakButtonProps) {
  const { addFavorite, removeFavorite, favoritePeaks, checkIsFavorite } = useFavoritePeakList();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite ?? false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (initialIsFavorite === undefined) {
        const status = await checkIsFavorite(peakId);
        setIsFavorite(status);
      }
    };
    checkStatus();
  }, [peakId, initialIsFavorite, checkIsFavorite]);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      if (isFavorite) {
        const favoritePeak = favoritePeaks.find((fp) => fp.peakId === peakId);
        if (favoritePeak) {
          await removeFavorite(favoritePeak.idFavoritePeak);
          setIsFavorite(false);
          onToggle?.(false);
        }
      } else {
        await addFavorite(peakId, userType);
        setIsFavorite(true);
        onToggle?.(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isLoading}
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

export { FavoritePeakButton };
