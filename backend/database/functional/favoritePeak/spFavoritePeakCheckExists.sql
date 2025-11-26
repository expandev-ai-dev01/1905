/**
 * @summary
 * Checks if a specific peak is in user's favorites list. Used for displaying
 * visual indicators in the UI.
 *
 * @procedure spFavoritePeakCheckExists
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/favorite-peak/check/:peakId
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
 * @param {NVARCHAR(100)} peakId
 *   - Required: Yes
 *   - Description: External peak identifier to check
 *
 * @testScenarios
 * - Returns true when peak is in favorites
 * - Returns false when peak is not in favorites
 * - Security validation for account/user access
 */
CREATE OR ALTER PROCEDURE [functional].[spFavoritePeakCheckExists]
  @idAccount INTEGER,
  @idUser INTEGER,
  @peakId NVARCHAR(100)
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   * @throw {idUserRequired}
   * @throw {peakIdRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF (@idUser IS NULL)
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  IF (@peakId IS NULL OR LTRIM(RTRIM(@peakId)) = '')
  BEGIN
    ;THROW 51000, 'peakIdRequired', 1;
  END;

  /**
   * @output {FavoritePeakExists, 1, 1}
   * @column {BIT} isFavorite - True if peak is in favorites, false otherwise
   */
  SELECT
    CAST(CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END AS BIT) AS [isFavorite]
  FROM [functional].[favoritePeak] favPk
  WHERE [favPk].[idAccount] = @idAccount
    AND [favPk].[idUser] = @idUser
    AND [favPk].[peakId] = @peakId;
END;
GO