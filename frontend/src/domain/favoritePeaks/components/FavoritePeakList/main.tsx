import { useState } from 'react';
import { Star, Trash2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { Skeleton } from '@/core/components/skeleton';
import { cn } from '@/core/lib/utils';
import { useFavoritePeakList } from '../../hooks/useFavoritePeakList';
import type { FavoritePeakListProps } from './types';

function FavoritePeakList({ className }: FavoritePeakListProps) {
  const { data: favorites, isLoading, removeFavorite, updatePosition } = useFavoritePeakList();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleRemove = async (idFavoritePeak: number) => {
    if (window.confirm('Tem certeza que deseja remover este pico dos favoritos?')) {
      setDeletingId(idFavoritePeak);
      try {
        await removeFavorite(idFavoritePeak);
      } catch (error) {
        console.error('Error removing favorite:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleMoveUp = async (idFavoritePeak: number, currentPosition: number) => {
    if (currentPosition > 1) {
      try {
        await updatePosition(idFavoritePeak, currentPosition - 1);
      } catch (error) {
        console.error('Error updating position:', error);
      }
    }
  };

  const handleMoveDown = async (idFavoritePeak: number, currentPosition: number) => {
    if (favorites && currentPosition < favorites.length) {
      try {
        await updatePosition(idFavoritePeak, currentPosition + 1);
      } catch (error) {
        console.error('Error updating position:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <Card className={cn('border-dashed', className)}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Star className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">Nenhum pico favorito</h3>
          <p className="text-muted-foreground text-center text-sm">
            Você ainda não adicionou picos aos favoritos.
            <br />
            Explore o mapa para encontrar picos interessantes!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {favorites.map((favorite, index) => (
        <Card key={favorite.idFavoritePeak} className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="text-muted-foreground h-5 w-5" />
                <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                <CardTitle className="text-base">Pico {favorite.peakId}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveUp(favorite.idFavoritePeak, favorite.position)}
                  disabled={index === 0}
                  aria-label="Mover para cima"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveDown(favorite.idFavoritePeak, favorite.position)}
                  disabled={index === favorites.length - 1}
                  aria-label="Mover para baixo"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(favorite.idFavoritePeak)}
                  disabled={deletingId === favorite.idFavoritePeak}
                  aria-label="Remover dos favoritos"
                >
                  <Trash2 className="text-destructive h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Posição:</span>
                <span className="font-medium">{favorite.position}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Adicionado em:</span>
                <span className="font-medium">
                  {new Date(favorite.dateCreated).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export { FavoritePeakList };
