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
  favoritePeakDelete,
  favoritePeakUpdatePosition,
  favoritePeakCheckExists,
} from '@/services/favoritePeak';

const securable = 'FAVORITE_PEAK';

const createBodySchema = z.object({
  peakId: z.string().min(1).max(100),
  userType: z.enum(['gratuito', 'premium']),
});

const deleteParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const updatePositionParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const updatePositionBodySchema = z.object({
  newPosition: z.number().int().positive(),
});

const checkExistsParamsSchema = z.object({
  peakId: z.string().min(1).max(100),
});

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

export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'DELETE' }]);

  const [validated, error] = await operation.delete(req, deleteParamsSchema);

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

export async function patchPositionHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const [validatedParams, paramsError] = await operation.update(req, updatePositionParamsSchema);

  if (!validatedParams) {
    return next(paramsError);
  }

  const bodyValidation = updatePositionBodySchema.safeParse(req.body);

  if (!bodyValidation.success) {
    return res.status(400).json(errorResponse('invalidRequestBody'));
  }

  try {
    await favoritePeakUpdatePosition({
      ...validatedParams.credential,
      idFavoritePeak: validatedParams.params.id,
      newPosition: bodyValidation.data.newPosition,
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

export async function checkExistsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, checkExistsParamsSchema);

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
