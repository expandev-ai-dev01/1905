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
  async create(dto: FavoritePeakCreateDto): Promise<{ idFavoritePeak: number }> {
    const { data } = await authenticatedClient.post<{ data: { idFavoritePeak: number } }>(
      '/favorite-peak',
      dto
    );
    return data.data;
  },

  /**
   * Remove a peak from favorites
   */
  async delete(idFavoritePeak: number): Promise<{ success: boolean }> {
    const { data } = await authenticatedClient.delete<{ data: { success: boolean } }>(
      `/favorite-peak/${idFavoritePeak}`
    );
    return data.data;
  },

  /**
   * Update position of a favorite peak
   */
  async updatePosition(
    idFavoritePeak: number,
    dto: FavoritePeakUpdatePositionDto
  ): Promise<{ success: boolean }> {
    const { data } = await authenticatedClient.patch<{ data: { success: boolean } }>(
      `/favorite-peak/${idFavoritePeak}/position`,
      dto
    );
    return data.data;
  },

  /**
   * Check if a peak is favorited
   */
  async check(peakId: string): Promise<FavoritePeakCheckResponse> {
    const { data } = await authenticatedClient.get<{ data: FavoritePeakCheckResponse }>(
      `/favorite-peak/check/${peakId}`
    );
    return data.data;
  },
};
