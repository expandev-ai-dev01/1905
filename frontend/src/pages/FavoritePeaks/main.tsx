import { useState } from 'react';
import { MapPin, Star } from 'lucide-react';
import { useFavoritePeaks } from '@/domain/favoritePeaks/hooks';
import { FavoritePeakCard } from '@/domain/favoritePeaks/components';
import { Button } from '@/core/components/button';
import { useNavigation } from '@/core/hooks/useNavigation';
import { cn } from '@/core/lib/utils';

function FavoritePeaksPage() {
  const { navigate } = useNavigation();
  const { favoritePeaks, isLoading, remove, updatePosition, isRemoving, isUpdatingPosition } =
    useFavoritePeaks();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleRemove = async (idFavoritePeak: number) => {
    try {
      await remove(idFavoritePeak);
    } catch (error) {
      alert('Erro ao remover favorito. Tente novamente.');
    }
  };

  const handleViewDetails = (peakId: string) => {
    navigate(`/peak/${peakId}`);
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const peak = favoritePeaks[index];
    if (!peak) return;

    try {
      await updatePosition({
        idFavoritePeak: peak.idFavoritePeak,
        dto: { newPosition: index },
      });
    } catch (error) {
      alert('Erro ao reordenar favoritos. Tente novamente.');
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === favoritePeaks.length - 1) return;
    const peak = favoritePeaks[index];
    if (!peak) return;

    try {
      await updatePosition({
        idFavoritePeak: peak.idFavoritePeak,
        dto: { newPosition: index + 2 },
      });
    } catch (error) {
      alert('Erro ao reordenar favoritos. Tente novamente.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="border-primary mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent"></div>
          <p className="text-muted-foreground">Carregando seus favoritos...</p>
        </div>
      </div>
    );
  }

  if (favoritePeaks.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="max-w-md text-center">
          <Star className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h2 className="mb-2 text-2xl font-bold">Nenhum pico favorito</h2>
          <p className="text-muted-foreground mb-6">
            Você ainda não adicionou picos aos favoritos. Explore o mapa para encontrar picos
            interessantes!
          </p>
          <Button onClick={() => navigate('/map')} className="gap-2">
            <MapPin className="h-4 w-4" />
            Explorar Mapa
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b pb-4">
        <h1 className="text-primary text-3xl font-bold tracking-tight">Meus Picos Favoritos</h1>
        <p className="text-muted-foreground">
          Gerencie seus picos favoritos e acesse rapidamente as previsões.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {favoritePeaks.map((peak, index) => (
          <div key={peak.idFavoritePeak} className="relative">
            <FavoritePeakCard
              favoritePeak={peak}
              onRemove={handleRemove}
              onViewDetails={handleViewDetails}
              isDragging={draggedIndex === index}
              dragHandleProps={{
                onMouseDown: () => setDraggedIndex(index),
                onMouseUp: () => setDraggedIndex(null),
              }}
            />
            <div className="absolute right-2 top-2 flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0 || isUpdatingPosition}
                className="h-6 w-6"
                aria-label="Mover para cima"
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleMoveDown(index)}
                disabled={index === favoritePeaks.length - 1 || isUpdatingPosition}
                className="h-6 w-6"
                aria-label="Mover para baixo"
              >
                ↓
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { FavoritePeaksPage };
