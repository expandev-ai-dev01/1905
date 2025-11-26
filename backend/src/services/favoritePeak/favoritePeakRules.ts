import { dbRequest, ExpectedReturn, IRecordSet } from '@/utils/database';

export interface FavoritePeakCreateRequest {
  idAccount: number;
  idUser: number;
  peakId: string;
  userType: 'gratuito' | 'premium';
}

export interface FavoritePeakListRequest {
  idAccount: number;
  idUser: number;
}

export interface FavoritePeakDeleteRequest {
  idAccount: number;
  idUser: number;
  idFavoritePeak: number;
}

export interface FavoritePeakUpdatePositionRequest {
  idAccount: number;
  idUser: number;
  idFavoritePeak: number;
  newPosition: number;
}

export interface FavoritePeakCheckExistsRequest {
  idAccount: number;
  idUser: number;
  peakId: string;
}

export interface FavoritePeakEntity {
  idFavoritePeak: number;
  peakId: string;
  position: number;
  dateCreated: Date;
}

export interface FavoritePeakCreateResult {
  idFavoritePeak: number;
}

export interface FavoritePeakCheckExistsResult {
  isFavorite: boolean;
}

export async function favoritePeakCreate(
  params: FavoritePeakCreateRequest
): Promise<FavoritePeakCreateResult> {
  const result = await dbRequest(
    '[functional].[spFavoritePeakCreate]',
    params,
    ExpectedReturn.Single
  );

  return result;
}

export async function favoritePeakList(
  params: FavoritePeakListRequest
): Promise<FavoritePeakEntity[]> {
  const result = (await dbRequest(
    '[functional].[spFavoritePeakList]',
    params,
    ExpectedReturn.Multi
  )) as IRecordSet<FavoritePeakEntity>[];

  return result[0] || [];
}

export async function favoritePeakDelete(params: FavoritePeakDeleteRequest): Promise<void> {
  await dbRequest('[functional].[spFavoritePeakDelete]', params, ExpectedReturn.None);
}

export async function favoritePeakUpdatePosition(
  params: FavoritePeakUpdatePositionRequest
): Promise<void> {
  await dbRequest('[functional].[spFavoritePeakUpdatePosition]', params, ExpectedReturn.None);
}

export async function favoritePeakCheckExists(
  params: FavoritePeakCheckExistsRequest
): Promise<FavoritePeakCheckExistsResult> {
  const result = await dbRequest(
    '[functional].[spFavoritePeakCheckExists]',
    params,
    ExpectedReturn.Single
  );

  return result;
}
