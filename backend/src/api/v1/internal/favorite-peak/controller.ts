import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import {
  favoritePeakCreate,
  favoritePeakList,
  favoritePeakGet,
  favoritePeakDelete,
  favoritePeakUpdatePosition,
  favoritePeakCheckExists,
} from '@/services/favoritePeak';

const securable = 'FAVORITE_PEAK';

const createBodySchema = z.object({
  peakId: z.string().min(1).max(100),
  userType: z.enum(['free', 'premium']),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const peakIdParamSchema = z.object({
  peakId: z.string().min(1).max(100),
});

const updatePositionBodySchema = z.object({
  newPosition: z.number().int().positive(),
});

/**
 * @api {post} /api/v1/internal/favorite-peak Create Favorite Peak
 * @apiName CreateFavoritePeak
 * @apiGroup FavoritePeak
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new favorite peak for the authenticated user
 *
 * @apiParam {String} peakId External peak identifier
 * @apiParam {String} userType User plan type ('free' or 'premium')
 *
 * @apiSuccess {Number} idFavoritePeak Created favorite peak identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const [validated, error] = await operation.create(req, createBodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await favoritePeakCreate({
      ...validated.credential,
      ...validated.body,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {get} /api/v1/internal/favorite-peak List Favorite Peaks
 * @apiName ListFavoritePeaks
 * @apiGroup FavoritePeak
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves list of favorite peaks for authenticated user
 *
 * @apiSuccess {Array} data List of favorite peaks
 *
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await favoritePeakList({
      ...validated.credential,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {get} /api/v1/internal/favorite-peak/:id Get Favorite Peak
 * @apiName GetFavoritePeak
 * @apiGroup FavoritePeak
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves a specific favorite peak by identifier
 *
 * @apiParam {Number} id Favorite peak identifier
 *
 * @apiSuccess {Object} data Favorite peak details
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, idParamSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await favoritePeakGet({
      ...validated.credential,
      idFavoritePeak: validated.params.id,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {delete} /api/v1/internal/favorite-peak/:id Delete Favorite Peak
 * @apiName DeleteFavoritePeak
 * @apiGroup FavoritePeak
 * @apiVersion 1.0.0
 *
 * @apiDescription Removes a favorite peak from user's list
 *
 * @apiParam {Number} id Favorite peak identifier
 *
 * @apiSuccess {Object} data Success confirmation
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'DELETE' }]);

  const [validated, error] = await operation.delete(req, idParamSchema);

  if (!validated) {
    return next(error);
  }

  try {
    await favoritePeakDelete({
      ...validated.credential,
      idFavoritePeak: validated.params.id,
    });

    res.json(successResponse({ deleted: true }));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {patch} /api/v1/internal/favorite-peak/:id/position Update Position
 * @apiName UpdateFavoritePeakPosition
 * @apiGroup FavoritePeak
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates the position of a favorite peak in user's list
 *
 * @apiParam {Number} id Favorite peak identifier
 * @apiParam {Number} newPosition New position in list
 *
 * @apiSuccess {Object} data Success confirmation
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function patchPositionHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const combinedSchema = z.object({
    id: z.coerce.number().int().positive(),
    newPosition: z.number().int().positive(),
  });

  const [validated, error] = await operation.update(req, combinedSchema);

  if (!validated) {
    return next(error);
  }

  try {
    await favoritePeakUpdatePosition({
      ...validated.credential,
      idFavoritePeak: validated.params.id,
      newPosition: validated.body.newPosition,
    });

    res.json(successResponse({ updated: true }));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {get} /api/v1/internal/favorite-peak/check/:peakId Check Favorite Status
 * @apiName CheckFavoritePeakExists
 * @apiGroup FavoritePeak
 * @apiVersion 1.0.0
 *
 * @apiDescription Checks if a peak is in user's favorites
 *
 * @apiParam {String} peakId External peak identifier
 *
 * @apiSuccess {Boolean} isFavorited True if peak is favorited
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function checkHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, peakIdParamSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await favoritePeakCheckExists({
      ...validated.credential,
      peakId: validated.params.peakId,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
