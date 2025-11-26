import { Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { cn } from '@/core/lib/utils';
import type { FavoritePeakCardProps } from './types';

function FavoritePeakCard({
  favoritePeak,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  isRemoving,
  className,
}: FavoritePeakCardProps) {
  return (
    <Card
      className={cn(
        'group transition-all duration-200 hover:shadow-md',
        isRemoving && 'opacity-50',
        className
      )}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMoveUp}
            disabled={isFirst || isRemoving}
            className="h-6 w-6"
            aria-label="Mover para cima"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <GripVertical className="text-muted-foreground h-5 w-5" />
          <Button
            variant="ghost"
            size="icon"
            onClick={onMoveDown}
            disabled={isLast || isRemoving}
            className="h-6 w-6"
            aria-label="Mover para baixo"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm font-medium">
              #{favoritePeak.position}
            </span>
            <h3 className="text-lg font-semibold">{favoritePeak.peakId}</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            Adicionado em {new Date(favoritePeak.dateCreated).toLocaleDateString('pt-BR')}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={isRemoving}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          aria-label="Remover dos favoritos"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}

export { FavoritePeakCard };
