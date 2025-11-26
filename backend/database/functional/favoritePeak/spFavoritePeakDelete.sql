/**
 * @summary
 * Removes a favorite peak from user's list and automatically reorders remaining peaks
 * to maintain sequential positions without gaps.
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
 * - Valid deletion with position reordering
 * - Rejection when favorite peak doesn't exist
 * - Rejection when favorite peak belongs to different user
 */
CREATE OR ALTER PROCEDURE [functional].[spFavoritePeakDelete]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idFavoritePeak INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @deletedPosition INTEGER;

  BEGIN TRY
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
    SELECT @deletedPosition = favPk.[position]
    FROM [functional].[favoritePeak] favPk
    WHERE favPk.[idFavoritePeak] = @idFavoritePeak
      AND favPk.[idAccount] = @idAccount
      AND favPk.[idUser] = @idUser;

    IF @deletedPosition IS NULL
    BEGIN
      ;THROW 51000, 'favoritePeakDoesntExist', 1;
    END;

    BEGIN TRAN;
      /**
       * @rule {FC-003} Delete favorite peak
       */
      DELETE FROM [functional].[favoritePeak]
      WHERE [idFavoritePeak] = @idFavoritePeak
        AND [idAccount] = @idAccount
        AND [idUser] = @idUser;

      /**
       * @rule {BR-009} Reorder remaining peaks to fill position gap
       */
      UPDATE favPk
      SET [position] = favPk.[position] - 1
      FROM [functional].[favoritePeak] favPk
      WHERE favPk.[idAccount] = @idAccount
        AND favPk.[idUser] = @idUser
        AND favPk.[position] > @deletedPosition;

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO