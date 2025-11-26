/**
 * @summary
 * Retrieves a specific favorite peak by identifier, validating user ownership.
 *
 * @procedure spFavoritePeakGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/favorite-peak/:id
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
 * @param {INT} idFavoritePeak
 *   - Required: Yes
 *   - Description: Favorite peak identifier
 *
 * @returns Favorite peak details
 *
 * @testScenarios
 * - Valid retrieval of existing favorite peak
 * - Rejection when favorite peak doesn't exist
 * - Rejection when favorite peak belongs to different user
 */
CREATE OR ALTER PROCEDURE [functional].[spFavoritePeakGet]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idFavoritePeak INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Validate required parameters
   * @throw {idAccountRequired}
   * @throw {idUserRequired}
   * @throw {idFavoritePeakRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF @idUser IS NULL
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  IF @idFavoritePeak IS NULL
  BEGIN
    ;THROW 51000, 'idFavoritePeakRequired', 1;
  END;

  /**
   * @validation Verify favorite peak exists and belongs to user
   * @throw {favoritePeakDoesntExist}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [functional].[favoritePeak] favPk
    WHERE favPk.[idFavoritePeak] = @idFavoritePeak
      AND favPk.[idAccount] = @idAccount
      AND favPk.[idUser] = @idUser
  )
  BEGIN
    ;THROW 51000, 'favoritePeakDoesntExist', 1;
  END;

  /**
   * @output {FavoritePeak, 1, n}
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
  WHERE favPk.[idFavoritePeak] = @idFavoritePeak
    AND favPk.[idAccount] = @idAccount
    AND favPk.[idUser] = @idUser;
END;
GO