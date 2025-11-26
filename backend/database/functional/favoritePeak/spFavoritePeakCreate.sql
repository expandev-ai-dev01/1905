/**
 * @summary
 * Creates a new favorite peak for a user. Validates user type limits
 * (free users: max 10 peaks, premium: unlimited) and prevents duplicate
 * peaks. Automatically assigns the next available position in the list.
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
 *   - Description: User plan type ('gratuito' or 'premium')
 *
 * @returns {INT} idFavoritePeak - Created favorite peak identifier
 *
 * @testScenarios
 * - Valid creation for free user within limit
 * - Valid creation for premium user
 * - Rejection when free user exceeds 10 peaks limit
 * - Rejection when peak already exists in user's favorites
 * - Rejection for invalid parameters
 */
CREATE OR ALTER PROCEDURE [functional].[spFavoritePeakCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @peakId NVARCHAR(100),
  @userType NVARCHAR(20)
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   * @throw {idUserRequired}
   * @throw {peakIdRequired}
   * @throw {userTypeRequired}
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

  IF (@userType IS NULL OR LTRIM(RTRIM(@userType)) = '')
  BEGIN
    ;THROW 51000, 'userTypeRequired', 1;
  END;

  /**
   * @validation User type validation
   * @throw {invalidUserType}
   */
  IF (@userType NOT IN ('gratuito', 'premium'))
  BEGIN
    ;THROW 51000, 'invalidUserType', 1;
  END;

  /**
   * @validation Check if peak already exists in user's favorites
   * @throw {peakAlreadyFavorited}
   */
  IF EXISTS (
    SELECT *
    FROM [functional].[favoritePeak] favPk
    WHERE [favPk].[idAccount] = @idAccount
      AND [favPk].[idUser] = @idUser
      AND [favPk].[peakId] = @peakId
  )
  BEGIN
    ;THROW 51000, 'peakAlreadyFavorited', 1;
  END;

  DECLARE @currentCount INTEGER;
  DECLARE @maxPosition INTEGER;

  /**
   * @rule {BR-003,BR-004} Validate user type limits
   * Free users: max 10 peaks, Premium users: unlimited
   */
  SELECT @currentCount = COUNT(*)
  FROM [functional].[favoritePeak] favPk
  WHERE [favPk].[idAccount] = @idAccount
    AND [favPk].[idUser] = @idUser;

  IF (@userType = 'gratuito' AND @currentCount >= 10)
  BEGIN
    ;THROW 51000, 'favoritePeakLimitReached', 1;
  END;

  /**
   * @rule {RU-005} Calculate next position in list
   */
  SELECT @maxPosition = ISNULL(MAX([position]), 0)
  FROM [functional].[favoritePeak] favPk
  WHERE [favPk].[idAccount] = @idAccount
    AND [favPk].[idUser] = @idUser;

  BEGIN TRY
    BEGIN TRAN;

      INSERT INTO [functional].[favoritePeak]
      ([idAccount], [idUser], [peakId], [position], [dateCreated])
      VALUES
      (@idAccount, @idUser, @peakId, @maxPosition + 1, GETUTCDATE());

      /**
       * @output {FavoritePeakCreated, 1, 1}
       * @column {INT} idFavoritePeak - Created favorite peak identifier
       */
      SELECT SCOPE_IDENTITY() AS [idFavoritePeak];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO