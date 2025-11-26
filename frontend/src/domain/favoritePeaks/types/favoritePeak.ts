export interface FavoritePeak {
  idFavoritePeak: number;
  peakId: string;
  position: number;
  dateCreated: string;
}

export interface FavoritePeakCreateDto {
  peakId: string;
  userType: 'gratuito' | 'premium';
}

export interface FavoritePeakUpdatePositionDto {
  newPosition: number;
}

export interface FavoritePeakCheckResponse {
  isFavorite: boolean;
}

export type UserType = 'gratuito' | 'premium';
