import { Star } from 'lucide-react';
import { Button } from '@/core/components/button';
import { cn } from '@/core/lib/utils';
import type { FavoriteButtonProps } from './types';

function FavoriteButton({
  isFavorite,
  isLoading,
  onClick,
  className,
  size = 'icon',
  variant = 'ghost',
}: FavoriteButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={isLoading}
      className={cn('transition-all duration-200', className)}
      aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
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
