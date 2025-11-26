import { MapPin, Waves, Wind, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { cn } from '@/core/lib/utils';
import type { FavoritePeakCardProps } from './types';

function FavoritePeakCard({
  peak,
  onViewDetails,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  isLoading,
}: FavoritePeakCardProps) {
  return (
    <Card
      className={cn(
        'group transition-all duration-200 hover:shadow-lg',
        isLoading && 'pointer-events-none opacity-50'
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-primary text-xl font-bold">{peak.peakName}</CardTitle>
            <div className="text-muted-foreground mt-1 flex items-center text-sm">
              <MapPin className="mr-1 h-4 w-4" aria-hidden="true" />
              <span>{peak.location}</span>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMoveUp}
              disabled={!canMoveUp || isLoading}
              className="h-8 w-8"
              aria-label="Mover para cima"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onMoveDown}
              disabled={!canMoveDown || isLoading}
              className="h-8 w-8"
              aria-label="Mover para baixo"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              disabled={isLoading}
              className="text-destructive hover:bg-destructive/10 h-8 w-8"
              aria-label="Remover dos favoritos"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {peak.currentConditions && (
          <div className="bg-muted/50 mb-4 grid grid-cols-2 gap-3 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Waves className="h-5 w-5 text-blue-500" aria-hidden="true" />
              <div>
                <p className="text-muted-foreground text-xs">Altura</p>
                <p className="font-semibold">{peak.currentConditions.waveHeight}m</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-green-500" aria-hidden="true" />
              <div>
                <p className="text-muted-foreground text-xs">Vento</p>
                <p className="font-semibold">{peak.currentConditions.windSpeed} km/h</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Direção</p>
              <p className="font-semibold">{peak.currentConditions.swellDirection}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Período</p>
              <p className="font-semibold">{peak.currentConditions.period}s</p>
            </div>
          </div>
        )}
        <Button onClick={onViewDetails} className="w-full" disabled={isLoading}>
          Ver Previsão Completa
        </Button>
      </CardContent>
    </Card>
  );
}

export { FavoritePeakCard };
