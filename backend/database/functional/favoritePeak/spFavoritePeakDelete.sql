/**
 * @summary
 * Removes a peak from user's favorites and automatically reorders remaining
 * peaks to maintain sequential positions without gaps.
 *
 * @procedure spFavoritePeakDelete
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - DELETE /api/v1/internal/favorite-peak/:id
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
 *   - Description: Favorite peak identifier to delete
 *
 * @testScenarios
 * - Valid deletion of favorite peak
 * - Automatic reordering of remaining peaks
 * - Rejection when peak doesn't exist
 * - Rejection when peak doesn't belong to user
 * - Security validation for account/user access
 */
CREATE OR ALTER PROCEDURE [functional].[spFavoritePeakDelete]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idFavoritePeak INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   * @throw {idUserRequired}
   * @throw {idFavoritePeakRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF (@idUser IS NULL)
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  IF (@idFavoritePeak IS NULL)
  BEGIN
    ;THROW 51000, 'idFavoritePeakRequired', 1;
  END;

  /**
   * @validation Check if favorite peak exists and belongs to user
   * @throw {favoritePeakNotFound}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [functional].[favoritePeak] favPk
    WHERE [favPk].[idFavoritePeak] = @idFavoritePeak
      AND [favPk].[idAccount] = @idAccount
      AND [favPk].[idUser] = @idUser
  )
  BEGIN
    ;THROW 51000, 'favoritePeakNotFound', 1;
  END;

  DECLARE @deletedPosition INTEGER;

  SELECT @deletedPosition = [position]
  FROM [functional].[favoritePeak] favPk
  WHERE [favPk].[idFavoritePeak] = @idFavoritePeak
    AND [favPk].[idAccount] = @idAccount
    AND [favPk].[idUser] = @idUser;

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {BR-009} Delete the favorite peak
       */
      DELETE FROM [functional].[favoritePeak]
      WHERE [idFavoritePeak] = @idFavoritePeak
        AND [idAccount] = @idAccount
        AND [idUser] = @idUser;

      /**
       * @rule {BR-009} Reorder remaining peaks to fill the gap
       */
      UPDATE [functional].[favoritePeak]
      SET [position] = [position] - 1
      WHERE [idAccount] = @idAccount
        AND [idUser] = @idUser
        AND [position] > @deletedPosition;

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO