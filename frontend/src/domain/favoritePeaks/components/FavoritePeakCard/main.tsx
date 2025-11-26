import { Trash2, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { cn } from '@/core/lib/utils';
import type { FavoritePeakCardProps } from './types';

function FavoritePeakCard({
  favoritePeak,
  onRemove,
  onViewDetails,
  isDragging,
  dragHandleProps,
}: FavoritePeakCardProps) {
  const handleRemove = () => {
    if (window.confirm(`Tem certeza que deseja remover ${favoritePeak.peakName} dos favoritos?`)) {
      onRemove(favoritePeak.idFavoritePeak);
    }
  };

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-md',
        isDragging && 'opacity-50 shadow-lg'
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="text-muted-foreground h-5 w-5" />
          </div>
          <CardTitle className="text-lg font-semibold">{favoritePeak.peakName}</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className="text-destructive hover:bg-destructive/10"
          aria-label={`Remover ${favoritePeak.peakName} dos favoritos`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 text-sm">{favoritePeak.location}</p>
        {favoritePeak.currentConditions && (
          <div className="bg-muted/50 mb-4 grid grid-cols-2 gap-2 rounded-md p-3">
            <div>
              <p className="text-muted-foreground text-xs">Altura</p>
              <p className="font-semibold">{favoritePeak.currentConditions.waveHeight}m</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Direção</p>
              <p className="font-semibold">{favoritePeak.currentConditions.swellDirection}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Período</p>
              <p className="font-semibold">{favoritePeak.currentConditions.period}s</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Vento</p>
              <p className="font-semibold">{favoritePeak.currentConditions.windSpeed} km/h</p>
            </div>
          </div>
        )}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onViewDetails(favoritePeak.peakId)}
        >
          Ver Previsão Completa
        </Button>
      </CardContent>
    </Card>
  );
}

export { FavoritePeakCard };
