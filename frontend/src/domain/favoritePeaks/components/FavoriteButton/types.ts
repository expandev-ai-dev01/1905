import type { VariantProps } from 'class-variance-authority';
import type { buttonVariants } from '@/core/components/button';

export interface FavoriteButtonProps {
  isFavorite: boolean;
  isLoading: boolean;
  onClick: () => void;
  className?: string;
  size?: VariantProps<typeof buttonVariants>['size'];
  variant?: VariantProps<typeof buttonVariants>['variant'];
}
