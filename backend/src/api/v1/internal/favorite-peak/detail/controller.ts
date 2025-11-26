import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { favoritePeakDelete } from '@/services/favoritePeak';

const securable = 'FAVORITE_PEAK';

/**
 * @api {delete} /internal/favorite-peak/:id Delete Favorite Peak
 * @apiName DeleteFavoritePeak
 * @apiGroup FavoritePeak
 * @apiVersion 1.0.0
 *
 * @apiDescription Removes a peak from user's favorites
 *
 * @apiParam {Number} id Favorite peak identifier
 *
 * @apiSuccess {Boolean} success Operation success status
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

  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const [validated, error] = await operation.delete(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    await favoritePeakDelete({
      ...validated.credential,
      idFavoritePeak: validated.params.id,
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
