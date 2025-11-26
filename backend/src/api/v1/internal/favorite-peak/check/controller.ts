import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { favoritePeakCheckExists } from '@/services/favoritePeak';

const securable = 'FAVORITE_PEAK';

/**
 * @api {get} /internal/favorite-peak/check/:peakId Check Favorite Peak
 * @apiName CheckFavoritePeak
 * @apiGroup FavoritePeak
 * @apiVersion 1.0.0
 *
 * @apiDescription Checks if a peak is in user's favorites
 *
 * @apiParam {String} peakId External peak identifier
 *
 * @apiSuccess {Boolean} isFavorite Indicates if peak is favorited
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const paramsSchema = z.object({
    peakId: z.string().min(1).max(100),
  });

  const [validated, error] = await operation.read(req, paramsSchema);

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
