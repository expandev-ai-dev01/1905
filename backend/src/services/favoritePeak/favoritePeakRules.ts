import { dbRequest, ExpectedReturn, IRecordSet } from '@/utils/database';

/**
 * @summary
 * Creates a new favorite peak for a user
 *
 * @function favoritePeakCreate
 * @module favoritePeak
 *
 * @param {object} params - Creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {string} params.peakId - External peak identifier
 * @param {string} params.userType - User plan type ('free' or 'premium')
 *
 * @returns {Promise<{ idFavoritePeak: number }>} Created favorite peak identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 */
export async function favoritePeakCreate(params: {
  idAccount: number;
  idUser: number;
  peakId: string;
  userType: string;
}): Promise<{ idFavoritePeak: number }> {
  const result = await dbRequest(
    '[functional].[spFavoritePeakCreate]',
    params,
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Retrieves list of favorite peaks for a user
 *
 * @function favoritePeakList
 * @module favoritePeak
 *
 * @param {object} params - List parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 *
 * @returns {Promise<Array>} List of favorite peaks
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function favoritePeakList(params: { idAccount: number; idUser: number }): Promise<
  Array<{
    idFavoritePeak: number;
    peakId: string;
    position: number;
    dateCreated: Date;
  }>
> {
  const result = await dbRequest(
    '[functional].[spFavoritePeakList]',
    params,
    ExpectedReturn.Multiple
  );

  return result;
}

/**
 * @summary
 * Retrieves a specific favorite peak
 *
 * @function favoritePeakGet
 * @module favoritePeak
 *
 * @param {object} params - Get parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idFavoritePeak - Favorite peak identifier
 *
 * @returns {Promise<object>} Favorite peak details
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function favoritePeakGet(params: {
  idAccount: number;
  idUser: number;
  idFavoritePeak: number;
}): Promise<{
  idFavoritePeak: number;
  peakId: string;
  position: number;
  dateCreated: Date;
}> {
  const result = await dbRequest('[functional].[spFavoritePeakGet]', params, ExpectedReturn.Single);

  return result;
}

/**
 * @summary
 * Deletes a favorite peak from user's list
 *
 * @function favoritePeakDelete
 * @module favoritePeak
 *
 * @param {object} params - Delete parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idFavoritePeak - Favorite peak identifier
 *
 * @returns {Promise<void>}
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function favoritePeakDelete(params: {
  idAccount: number;
  idUser: number;
  idFavoritePeak: number;
}): Promise<void> {
  await dbRequest('[functional].[spFavoritePeakDelete]', params, ExpectedReturn.None);
}

/**
 * @summary
 * Updates the position of a favorite peak in user's list
 *
 * @function favoritePeakUpdatePosition
 * @module favoritePeak
 *
 * @param {object} params - Update parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idFavoritePeak - Favorite peak identifier
 * @param {number} params.newPosition - New position in list
 *
 * @returns {Promise<void>}
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function favoritePeakUpdatePosition(params: {
  idAccount: number;
  idUser: number;
  idFavoritePeak: number;
  newPosition: number;
}): Promise<void> {
  await dbRequest('[functional].[spFavoritePeakUpdatePosition]', params, ExpectedReturn.None);
}

/**
 * @summary
 * Checks if a peak is in user's favorites
 *
 * @function favoritePeakCheckExists
 * @module favoritePeak
 *
 * @param {object} params - Check parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {string} params.peakId - External peak identifier
 *
 * @returns {Promise<{ isFavorited: boolean }>} Favorite status
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function favoritePeakCheckExists(params: {
  idAccount: number;
  idUser: number;
  peakId: string;
}): Promise<{ isFavorited: boolean }> {
  const result = await dbRequest(
    '[functional].[spFavoritePeakCheckExists]',
    params,
    ExpectedReturn.Single
  );

  return result;
}
