import { Router } from 'express';
import * as favoritePeakController from '@/api/v1/internal/favorite-peak/controller';
import * as favoritePeakDetailController from '@/api/v1/internal/favorite-peak/detail/controller';
import * as favoritePeakPositionController from '@/api/v1/internal/favorite-peak/detail/position/controller';
import * as favoritePeakCheckController from '@/api/v1/internal/favorite-peak/check/controller';

const router = Router();

router.get('/favorite-peak', favoritePeakController.getHandler);
router.post('/favorite-peak', favoritePeakController.postHandler);
router.delete('/favorite-peak/:id', favoritePeakDetailController.deleteHandler);
router.patch('/favorite-peak/:id/position', favoritePeakPositionController.patchHandler);
router.get('/favorite-peak/check/:peakId', favoritePeakCheckController.getHandler);

export default router;
