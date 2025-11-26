/**
 * @summary
 * Updates the position of a favorite peak in user's list and automatically
 * reorders other peaks to maintain sequential positions. Validates that new
 * position is within valid range.
 *
 * @procedure spFavoritePeakUpdatePosition
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - PATCH /api/v1/internal/favorite-peak/:id/position
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
 *   - Description: Favorite peak identifier to reorder
 *
 * @param {INT} newPosition
 *   - Required: Yes
 *   - Description: New position in list (1-based index)
 *
 * @testScenarios
 * - Valid position update moving peak up in list
 * - Valid position update moving peak down in list
 * - Rejection when new position exceeds total peaks
 * - Rejection when new position is less than 1
 * - Rejection when peak doesn't exist
 * - Automatic reordering of affected peaks
 */
CREATE OR ALTER PROCEDURE [functional].[spFavoritePeakUpdatePosition]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idFavoritePeak INTEGER,
  @newPosition INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   * @throw {idUserRequired}
   * @throw {idFavoritePeakRequired}
   * @throw {newPositionRequired}
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

  IF (@newPosition IS NULL)
  BEGIN
    ;THROW 51000, 'newPositionRequired', 1;
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

  DECLARE @currentPosition INTEGER;
  DECLARE @totalPeaks INTEGER;

  SELECT
    @currentPosition = [position]
  FROM [functional].[favoritePeak] favPk
  WHERE [favPk].[idFavoritePeak] = @idFavoritePeak
    AND [favPk].[idAccount] = @idAccount
    AND [favPk].[idUser] = @idUser;

  SELECT @totalPeaks = COUNT(*)
  FROM [functional].[favoritePeak] favPk
  WHERE [favPk].[idAccount] = @idAccount
    AND [favPk].[idUser] = @idUser;

  /**
   * @validation Validate new position is within valid range
   * @throw {invalidPosition}
   */
  IF (@newPosition < 1 OR @newPosition > @totalPeaks)
  BEGIN
    ;THROW 51000, 'invalidPosition', 1;
  END;

  /**
   * @remarks Skip update if position hasn't changed
   */
  IF (@currentPosition = @newPosition)
  BEGIN
    RETURN;
  END;

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {BR-011} Reorder peaks based on direction of movement
       */
      IF (@newPosition < @currentPosition)
      BEGIN
        UPDATE [functional].[favoritePeak]
        SET [position] = [position] + 1
        WHERE [idAccount] = @idAccount
          AND [idUser] = @idUser
          AND [position] >= @newPosition
          AND [position] < @currentPosition;
      END
      ELSE
      BEGIN
        UPDATE [functional].[favoritePeak]
        SET [position] = [position] - 1
        WHERE [idAccount] = @idAccount
          AND [idUser] = @idUser
          AND [position] > @currentPosition
          AND [position] <= @newPosition;
      END;

      UPDATE [functional].[favoritePeak]
      SET [position] = @newPosition
      WHERE [idFavoritePeak] = @idFavoritePeak
        AND [idAccount] = @idAccount
        AND [idUser] = @idUser;

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO