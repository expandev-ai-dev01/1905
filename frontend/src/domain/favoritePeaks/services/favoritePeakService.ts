import { authenticatedClient } from '@/core/lib/api';
import type {
  FavoritePeak,
  CreateFavoritePeakDto,
  UpdatePositionDto,
  CheckFavoriteResponse,
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
    const { data } = await authenticatedClient.get('/favorite-peak');
    return data.data;
  },

  /**
   * Create a new favorite peak
   */
  async create(dto: CreateFavoritePeakDto): Promise<{ idFavoritePeak: number }> {
    const { data } = await authenticatedClient.post('/favorite-peak', dto);
    return data.data;
  },

  /**
   * Delete a favorite peak by ID
   */
  async delete(idFavoritePeak: number): Promise<{ success: boolean }> {
    const { data } = await authenticatedClient.delete(`/favorite-peak/${idFavoritePeak}`);
    return data.data;
  },

  /**
   * Update position of a favorite peak
   */
  async updatePosition(
    idFavoritePeak: number,
    dto: UpdatePositionDto
  ): Promise<{ success: boolean }> {
    const { data } = await authenticatedClient.patch(
      `/favorite-peak/${idFavoritePeak}/position`,
      dto
    );
    return data.data;
  },

  /**
   * Check if a peak is in user's favorites
   */
  async checkExists(peakId: string): Promise<CheckFavoriteResponse> {
    const { data } = await authenticatedClient.get(`/favorite-peak/check/${peakId}`);
    return data.data;
  },
};
