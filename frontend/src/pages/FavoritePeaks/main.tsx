import { useState } from 'react';
import { Star, AlertCircle } from 'lucide-react';
import { useFavoritePeaks } from '@/domain/favoritePeaks/hooks';
import { FavoritePeakCard } from '@/domain/favoritePeaks/components';
import { Alert, AlertDescription } from '@/core/components/alert';
import { Button } from '@/core/components/button';
import { useNavigation } from '@/core/hooks/useNavigation';

function FavoritePeaksPage() {
  const { navigate } = useNavigation();
  const { favoritePeaks, isLoading, remove, updatePosition, isRemoving, isUpdatingPosition } =
    useFavoritePeaks();
  const [removingId, setRemovingId] = useState<number | null>(null);

  const handleRemove = async (idFavoritePeak: number) => {
    try {
      setRemovingId(idFavoritePeak);
      await remove(idFavoritePeak);
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleMoveUp = async (idFavoritePeak: number, currentPosition: number) => {
    if (currentPosition <= 1) return;
    try {
      await updatePosition({ idFavoritePeak, dto: { newPosition: currentPosition - 1 } });
    } catch (error) {
      console.error('Erro ao mover favorito:', error);
    }
  };

  const handleMoveDown = async (
    idFavoritePeak: number,
    currentPosition: number,
    totalPeaks: number
  ) => {
    if (currentPosition >= totalPeaks) return;
    try {
      await updatePosition({ idFavoritePeak, dto: { newPosition: currentPosition + 1 } });
    } catch (error) {
      console.error('Erro ao mover favorito:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="border-primary mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent"></div>
          <p className="text-muted-foreground">Carregando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b pb-4">
        <div className="flex items-center gap-3">
          <Star className="h-8 w-8 fill-yellow-500 text-yellow-500" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meus Picos Favoritos</h1>
            <p className="text-muted-foreground">Gerencie seus picos de surf preferidos</p>
          </div>
        </div>
      </header>

      {favoritePeaks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
          <Star className="text-muted-foreground mb-4 h-16 w-16" />
          <h2 className="mb-2 text-xl font-semibold">Nenhum pico favorito ainda</h2>
          <p className="text-muted-foreground mb-6">
            Você ainda não adicionou picos aos favoritos. Explore o mapa para encontrar picos
            interessantes!
          </p>
          <Button onClick={() => navigate('/')} size="lg">
            Explorar Mapa
          </Button>
        </div>
      ) : (
        <>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Use as setas para reordenar seus picos favoritos. A ordem será salva automaticamente.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            {favoritePeaks.map((peak, index) => (
              <FavoritePeakCard
                key={peak.idFavoritePeak}
                favoritePeak={peak}
                onRemove={() => handleRemove(peak.idFavoritePeak)}
                onMoveUp={() => handleMoveUp(peak.idFavoritePeak, peak.position)}
                onMoveDown={() =>
                  handleMoveDown(peak.idFavoritePeak, peak.position, favoritePeaks.length)
                }
                isFirst={index === 0}
                isLast={index === favoritePeaks.length - 1}
                isRemoving={removingId === peak.idFavoritePeak || isRemoving || isUpdatingPosition}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export { FavoritePeaksPage };
