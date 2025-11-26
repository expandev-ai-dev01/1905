/**
 * @summary
 * Updates the position of a favorite peak in user's list and automatically reorders
 * other peaks to maintain sequential positions. Validates new position is within valid range.
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
 * - Valid position update with automatic reordering
 * - Rejection when new position exceeds list size
 * - Rejection when new position is less than 1
 * - Rejection when favorite peak doesn't exist
 */
CREATE OR ALTER PROCEDURE [functional].[spFavoritePeakUpdatePosition]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idFavoritePeak INTEGER,
  @newPosition INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @oldPosition INTEGER;
  DECLARE @totalPeaks INTEGER;

  BEGIN TRY
    /**
     * @validation Validate required parameters
     * @throw {idAccountRequired}
     * @throw {idUserRequired}
     * @throw {idFavoritePeakRequired}
     * @throw {newPositionRequired}
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

    IF @newPosition IS NULL
    BEGIN
      ;THROW 51000, 'newPositionRequired', 1;
    END;

    /**
     * @validation Verify favorite peak exists and belongs to user
     * @throw {favoritePeakDoesntExist}
     */
    SELECT @oldPosition = favPk.[position]
    FROM [functional].[favoritePeak] favPk
    WHERE favPk.[idFavoritePeak] = @idFavoritePeak
      AND favPk.[idAccount] = @idAccount
      AND favPk.[idUser] = @idUser;

    IF @oldPosition IS NULL
    BEGIN
      ;THROW 51000, 'favoritePeakDoesntExist', 1;
    END;

    /**
     * @validation Get total peaks count and validate new position
     * @throw {invalidPosition}
     */
    SELECT @totalPeaks = COUNT(*)
    FROM [functional].[favoritePeak] favPk
    WHERE favPk.[idAccount] = @idAccount
      AND favPk.[idUser] = @idUser;

    IF (@newPosition < 1) OR (@newPosition > @totalPeaks)
    BEGIN
      ;THROW 51000, 'invalidPosition', 1;
    END;

    /**
     * @remarks Skip update if position hasn't changed
     */
    IF @oldPosition = @newPosition
    BEGIN
      RETURN;
    END;

    BEGIN TRAN;
      /**
       * @rule {FC-004,BR-011} Reorder peaks based on direction of movement
       */
      IF @newPosition < @oldPosition
      BEGIN
        /**
         * @remarks Moving up: shift down peaks between new and old position
         */
        UPDATE favPk
        SET [position] = favPk.[position] + 1
        FROM [functional].[favoritePeak] favPk
        WHERE favPk.[idAccount] = @idAccount
          AND favPk.[idUser] = @idUser
          AND favPk.[position] >= @newPosition
          AND favPk.[position] < @oldPosition;
      END
      ELSE
      BEGIN
        /**
         * @remarks Moving down: shift up peaks between old and new position
         */
        UPDATE favPk
        SET [position] = favPk.[position] - 1
        FROM [functional].[favoritePeak] favPk
        WHERE favPk.[idAccount] = @idAccount
          AND favPk.[idUser] = @idUser
          AND favPk.[position] > @oldPosition
          AND favPk.[position] <= @newPosition;
      END;

      /**
       * @rule {FC-004} Update target peak to new position
       */
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