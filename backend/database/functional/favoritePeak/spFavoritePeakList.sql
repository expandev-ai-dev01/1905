/**
 * @summary
 * Retrieves the list of favorite peaks for a specific user, ordered by position.
 * Returns peak identifiers and metadata for frontend display.
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
 * @returns Array of favorite peaks with position and metadata
 *
 * @testScenarios
 * - Valid list retrieval for user with favorites
 * - Empty list for user without favorites
 * - Rejection when user doesn't exist
 */
CREATE OR ALTER PROCEDURE [functional].[spFavoritePeakList]
  @idAccount INTEGER,
  @idUser INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Validate required parameters
   * @throw {idAccountRequired}
   * @throw {idUserRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF @idUser IS NULL
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
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
   * @output {FavoritePeakList, n, n}
   * @column {INT} idFavoritePeak - Favorite peak identifier
   * @column {NVARCHAR} peakId - External peak identifier
   * @column {INT} position - Position in user's list
   * @column {DATETIME2} dateCreated - Date when peak was favorited
   */
  SELECT
    favPk.[idFavoritePeak],
    favPk.[peakId],
    favPk.[position],
    favPk.[dateCreated]
  FROM [functional].[favoritePeak] favPk
  WHERE favPk.[idAccount] = @idAccount
    AND favPk.[idUser] = @idUser
  ORDER BY
    favPk.[position];
END;
GO