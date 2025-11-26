/**
 * @summary
 * Retrieves the list of favorite peaks for a user, ordered by position.
 * Returns peak identifiers and positions for frontend integration with
 * forecast data.
 *
 * @procedure spFavoritePeakList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/favorite-peak
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier
 *
 * @testScenarios
 * - Valid retrieval of user's favorite peaks
 * - Empty list for user with no favorites
 * - Correct ordering by position
 * - Security validation for account/user access
 */
CREATE OR ALTER PROCEDURE [functional].[spFavoritePeakList]
  @idAccount INTEGER,
  @idUser INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   * @throw {idUserRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF (@idUser IS NULL)
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  /**
   * @output {FavoritePeakList, n, n}
   * @column {INT} idFavoritePeak - Favorite peak identifier
   * @column {NVARCHAR} peakId - External peak identifier
   * @column {INT} position - Position in user's list
   * @column {DATETIME2} dateCreated - Date added to favorites
   */
  SELECT
    [favPk].[idFavoritePeak],
    [favPk].[peakId],
    [favPk].[position],
    [favPk].[dateCreated]
  FROM [functional].[favoritePeak] favPk
  WHERE [favPk].[idAccount] = @idAccount
    AND [favPk].[idUser] = @idUser
  ORDER BY
    [favPk].[position];
END;
GO