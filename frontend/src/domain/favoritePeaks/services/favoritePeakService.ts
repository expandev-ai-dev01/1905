import { authenticatedClient } from '@/core/lib/api';
import type {
  FavoritePeak,
  FavoritePeakCreateDto,
  FavoritePeakUpdatePositionDto,
  FavoritePeakCheckResponse,
} from '../types';

/**
 * @service FavoritePeakService
 * @domain favoritePeaks
 * @type REST
 */
export const favoritePeakService = {
  /**
   * List all favorite peaks for authenticated user
   */
  async list(): Promise<FavoritePeak[]> {
    const { data } = await authenticatedClient.get<{ data: FavoritePeak[] }>('/favorite-peak');
    return data.data;
  },

  /**
   * Add a peak to favorites
   */
  async create(dto: FavoritePeakCreateDto): Promise<FavoritePeak> {
    const { data } = await authenticatedClient.post<{ data: FavoritePeak }>('/favorite-peak', dto);
    return data.data;
  },

  /**
   * Remove a peak from favorites
   */
  async delete(idFavoritePeak: number): Promise<void> {
    await authenticatedClient.delete(`/favorite-peak/${idFavoritePeak}`);
  },

  /**
   * Update position of a favorite peak
   */
  async updatePosition(idFavoritePeak: number, dto: FavoritePeakUpdatePositionDto): Promise<void> {
    await authenticatedClient.patch(`/favorite-peak/${idFavoritePeak}/position`, dto);
  },

  /**
   * Check if a peak is favorited
   */
  async checkExists(peakId: string): Promise<FavoritePeakCheckResponse> {
    const { data } = await authenticatedClient.get<{ data: FavoritePeakCheckResponse }>(
      `/favorite-peak/check/${peakId}`
    );
    return data.data;
  },
};
