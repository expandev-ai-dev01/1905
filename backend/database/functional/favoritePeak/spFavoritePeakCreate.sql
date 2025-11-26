/**
 * @summary
 * Creates a new favorite peak entry for a user. Validates user type limits
 * (free users: 10 peaks max, premium: unlimited) and prevents duplicate entries.
 * Automatically assigns the next available position in the user's list.
 *
 * @procedure spFavoritePeakCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/favorite-peak
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
 *   - Description: External peak identifier from forecast system
 *
 * @param {NVARCHAR(20)} userType
 *   - Required: Yes
 *   - Description: User plan type ('free' or 'premium')
 *
 * @returns {INT} idFavoritePeak - Created favorite peak identifier
 *
 * @testScenarios
 * - Valid creation for free user within limit
 * - Valid creation for premium user
 * - Rejection when free user exceeds 10 peaks limit
 * - Rejection when peak already favorited
 * - Rejection when user doesn't exist
 */
CREATE OR ALTER PROCEDURE [functional].[spFavoritePeakCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @peakId NVARCHAR(100),
  @userType NVARCHAR(20)
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @currentCount INTEGER;
  DECLARE @nextPosition INTEGER;

  BEGIN TRY
    /**
     * @validation Validate required parameters
     * @throw {idAccountRequired}
     * @throw {idUserRequired}
     * @throw {peakIdRequired}
     * @throw {userTypeRequired}
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

    IF @userType IS NULL OR LTRIM(RTRIM(@userType)) = ''
    BEGIN
      ;THROW 51000, 'userTypeRequired', 1;
    END;

    /**
     * @validation Validate user type values
     * @throw {invalidUserType}
     */
    IF @userType NOT IN ('free', 'premium')
    BEGIN
      ;THROW 51000, 'invalidUserType', 1;
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
     * @validation Check if peak already favorited
     * @throw {peakAlreadyFavorited}
     */
    IF EXISTS (
      SELECT *
      FROM [functional].[favoritePeak] favPk
      WHERE favPk.[idAccount] = @idAccount
        AND favPk.[idUser] = @idUser
        AND favPk.[peakId] = @peakId
    )
    BEGIN
      ;THROW 51000, 'peakAlreadyFavorited', 1;
    END;

    /**
     * @rule {BR-003,BR-004} Validate favorite peaks limit based on user type
     * @throw {freeLimitReached}
     */
    SELECT @currentCount = COUNT(*)
    FROM [functional].[favoritePeak] favPk
    WHERE favPk.[idAccount] = @idAccount
      AND favPk.[idUser] = @idUser;

    IF (@userType = 'free') AND (@currentCount >= 10)
    BEGIN
      ;THROW 51000, 'freeLimitReached', 1;
    END;

    /**
     * @rule {RU-005} Calculate next position in list
     */
    SELECT @nextPosition = ISNULL(MAX(favPk.[position]), 0) + 1
    FROM [functional].[favoritePeak] favPk
    WHERE favPk.[idAccount] = @idAccount
      AND favPk.[idUser] = @idUser;

    BEGIN TRAN;
      /**
       * @rule {FC-001} Insert new favorite peak
       */
      INSERT INTO [functional].[favoritePeak] (
        [idAccount],
        [idUser],
        [peakId],
        [position],
        [dateCreated]
      )
      VALUES (
        @idAccount,
        @idUser,
        @peakId,
        @nextPosition,
        GETUTCDATE()
      );

      /**
       * @output {FavoritePeakCreated, 1, 1}
       * @column {INT} idFavoritePeak - Created favorite peak identifier
       */
      SELECT SCOPE_IDENTITY() idFavoritePeak;

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO