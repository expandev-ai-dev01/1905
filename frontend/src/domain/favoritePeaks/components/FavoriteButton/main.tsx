import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/core/components/button';
import { useFavoritePeaks } from '../../hooks';
import { cn } from '@/core/lib/utils';
import type { FavoriteButtonProps } from './types';

function FavoriteButton({ peakId, peakName, userType, className }: FavoriteButtonProps) {
  const { favoritePeaks, create, remove, checkExists, isCreating, isRemoving } = useFavoritePeaks();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const result = await checkExists(peakId);
        setIsFavorite(result.isFavorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkFavoriteStatus();
  }, [peakId, checkExists]);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        const favoritePeak = favoritePeaks.find((fp) => fp.peakId === peakId);
        if (favoritePeak) {
          await remove(favoritePeak.idFavoritePeak);
          setIsFavorite(false);
        }
      } else {
        if (userType === 'gratuito' && favoritePeaks.length >= 10) {
          alert(
            'Você atingiu o limite de 10 picos favoritos. Faça upgrade para o plano premium para adicionar mais.'
          );
          return;
        }
        await create({ peakId, userType });
        setIsFavorite(true);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Erro ao processar favorito. Tente novamente.');
      }
    }
  };

  const isProcessing = isCreating || isRemoving || isChecking;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleFavorite}
      disabled={isProcessing}
      className={cn('transition-all duration-200', className)}
      aria-label={
        isFavorite ? `Remover ${peakName} dos favoritos` : `Adicionar ${peakName} aos favoritos`
      }
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
