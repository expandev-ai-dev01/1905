/**
 * @summary
 * Checks if a specific peak is already in user's favorites list.
 * Used for UI state management to show/hide favorite indicators.
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
 * @returns Boolean indicating if peak is favorited
 *
 * @testScenarios
 * - Returns true for favorited peak
 * - Returns false for non-favorited peak
 * - Rejection when user doesn't exist
 */
CREATE OR ALTER PROCEDURE [functional].[spFavoritePeakCheckExists]
  @idAccount INTEGER,
  @idUser INTEGER,
  @peakId NVARCHAR(100)
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Validate required parameters
   * @throw {idAccountRequired}
   * @throw {idUserRequired}
   * @throw {peakIdRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF @idUser IS NULL
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  IF @peakId IS NULL OR LTRIM(RTRIM(@peakId)) = ''
  BEGIN
    ;THROW 51000, 'peakIdRequired', 1;
  END;

  /**
   * @validation Verify user exists and belongs to account
   * @throw {userDoesntExist}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [security].[user] usr
    WHERE usr.[idUser] = @idUser
      AND usr.[idAccount] = @idAccount
  )
  BEGIN
    ;THROW 51000, 'userDoesntExist', 1;
  END;

  /**
   * @output {FavoritePeakExists, 1, 1}
   * @column {BIT} isFavorited - True if peak is in favorites, false otherwise
   */
  SELECT
    CAST(
      CASE
        WHEN EXISTS (
          SELECT *
          FROM [functional].[favoritePeak] favPk
          WHERE favPk.[idAccount] = @idAccount
            AND favPk.[idUser] = @idUser
            AND favPk.[peakId] = @peakId
        )
        THEN 1
        ELSE 0
      END AS BIT
    ) isFavorited;
END;
GO