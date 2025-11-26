export interface FavoritePeak {
  idFavoritePeak: number;
  peakId: string;
  peakName: string;
  location: string;
  position: number;
  dateAdded: string;
}

export interface FavoritePeakPreview extends FavoritePeak {
  currentConditions?: {
    waveHeight: number;
    swellDirection: string;
    period: number;
    windSpeed: number;
  };
}

export interface CreateFavoritePeakDto {
  peakId: string;
  userType: 'gratuito' | 'premium';
}

export interface UpdatePositionDto {
  newPosition: number;
}

export interface CheckFavoriteResponse {
  isFavorite: boolean;
}
