/*
DROP TABLE IF EXISTS [functional].[favoritePeak];
DROP SCHEMA IF EXISTS [functional];
GO
*/

/**
 * @schema functional
 * Business logic schema for surf forecast application
 */
CREATE SCHEMA [functional];
GO

/**
 * @table favoritePeak User's favorite surf peaks management
 * @multitenancy true
 * @softDelete false
 * @alias favPk
 */
CREATE TABLE [functional].[favoritePeak] (
  [idFavoritePeak] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [peakId] NVARCHAR(100) NOT NULL,
  [position] INTEGER NOT NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE())
);
GO

/**
 * @primaryKey pkFavoritePeak
 * @keyType Object
 */
ALTER TABLE [functional].[favoritePeak]
ADD CONSTRAINT [pkFavoritePeak] PRIMARY KEY CLUSTERED ([idFavoritePeak]);
GO

/**
 * @foreignKey fkFavoritePeak_Account
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[favoritePeak]
ADD CONSTRAINT [fkFavoritePeak_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkFavoritePeak_User
 * @target security.user
 */
ALTER TABLE [functional].[favoritePeak]
ADD CONSTRAINT [fkFavoritePeak_User] FOREIGN KEY ([idUser])
REFERENCES [security].[user]([idUser]);
GO

/**
 * @index ixFavoritePeak_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixFavoritePeak_Account]
ON [functional].[favoritePeak]([idAccount]);
GO

/**
 * @index ixFavoritePeak_User
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixFavoritePeak_User]
ON [functional].[favoritePeak]([idAccount], [idUser]);
GO

/**
 * @index uqFavoritePeak_Account_User_Peak
 * @type Performance
 * @unique true
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqFavoritePeak_Account_User_Peak]
ON [functional].[favoritePeak]([idAccount], [idUser], [peakId]);
GO

/**
 * @index ixFavoritePeak_Position
 * @type Performance
 */
CREATE NONCLUSTERED INDEX [ixFavoritePeak_Position]
ON [functional].[favoritePeak]([idAccount], [idUser], [position]);
GO