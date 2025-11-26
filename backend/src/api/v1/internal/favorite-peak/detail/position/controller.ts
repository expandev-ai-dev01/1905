import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { favoritePeakUpdatePosition } from '@/services/favoritePeak';

const securable = 'FAVORITE_PEAK';

/**
 * @api {patch} /internal/favorite-peak/:id/position Update Favorite Peak Position
 * @apiName UpdateFavoritePeakPosition
 * @apiGroup FavoritePeak
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates position of a favorite peak in user's list
 *
 * @apiParam {Number} id Favorite peak identifier
 * @apiParam {Number} newPosition New position in list (1-based)
 *
 * @apiSuccess {Boolean} success Operation success status
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function patchHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const bodySchema = z.object({
    newPosition: z.number().int().positive(),
  });

  const [validated, error] = await operation.patch(req, paramsSchema, bodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    await favoritePeakUpdatePosition({
      ...validated.credential,
      idFavoritePeak: validated.params.id,
      newPosition: validated.body.newPosition,
    });

    res.json(successResponse({ success: true }));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
