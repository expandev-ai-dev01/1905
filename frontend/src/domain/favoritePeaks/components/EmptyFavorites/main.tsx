import { Star, TrendingUp } from 'lucide-react';
import { Button } from '@/core/components/button';
import type { EmptyFavoritesProps } from './types';

function EmptyFavorites({ onExplore }: EmptyFavoritesProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
      <div className="bg-muted mb-4 rounded-full p-6">
        <Star className="text-muted-foreground h-12 w-12" aria-hidden="true" />
      </div>
      <h2 className="mb-2 text-2xl font-bold">Nenhum pico favorito ainda</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Você ainda não adicionou picos aos favoritos. Explore o mapa para encontrar picos
        interessantes e adicione-os aqui para acesso rápido às previsões.
      </p>
      <Button onClick={onExplore} size="lg" className="gap-2">
        <TrendingUp className="h-5 w-5" aria-hidden="true" />
        Explorar Picos
      </Button>
    </div>
  );
}

export { EmptyFavorites };
