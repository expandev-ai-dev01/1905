/**
 * @interface FavoritePeakEntity
 * @description Represents a favorite peak entity in the system
 *
 * @property {number} idFavoritePeak - Unique favorite peak identifier
 * @property {number} idAccount - Associated account identifier
 * @property {number} idUser - User identifier
 * @property {string} peakId - External peak identifier
 * @property {number} position - Position in user's favorites list
 * @property {Date} dateCreated - Creation timestamp
 */
export interface FavoritePeakEntity {
  idFavoritePeak: number;
  idAccount: number;
  idUser: number;
  peakId: string;
  position: number;
  dateCreated: Date;
}

/**
 * @interface FavoritePeakCreateRequest
 * @description Request parameters for creating a favorite peak
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {string} peakId - External peak identifier
 * @property {string} userType - User plan type ('free' or 'premium')
 */
export interface FavoritePeakCreateRequest {
  idAccount: number;
  idUser: number;
  peakId: string;
  userType: string;
}

/**
 * @interface FavoritePeakListResponse
 * @description Response format for favorite peaks list
 *
 * @property {number} idFavoritePeak - Favorite peak identifier
 * @property {string} peakId - External peak identifier
 * @property {number} position - Position in list
 * @property {Date} dateCreated - Creation timestamp
 */
export interface FavoritePeakListResponse {
  idFavoritePeak: number;
  peakId: string;
  position: number;
  dateCreated: Date;
}

/**
 * @interface FavoritePeakUpdatePositionRequest
 * @description Request parameters for updating favorite peak position
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} idFavoritePeak - Favorite peak identifier
 * @property {number} newPosition - New position in list
 */
export interface FavoritePeakUpdatePositionRequest {
  idAccount: number;
  idUser: number;
  idFavoritePeak: number;
  newPosition: number;
}

/**
 * @interface FavoritePeakCheckExistsResponse
 * @description Response format for checking if peak is favorited
 *
 * @property {boolean} isFavorited - True if peak is in favorites
 */
export interface FavoritePeakCheckExistsResponse {
  isFavorited: boolean;
}
