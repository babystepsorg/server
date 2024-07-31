import { Router } from 'express';
import * as UserHandler from './user.handler';
import { validateRequest } from '../../../middlewares';
import { z } from 'zod';

const router = Router();

router.get(
  '/',
  UserHandler.getAllUsers
);

router.delete(
  '/:id',
  UserHandler.deleteUser
);

router.get(
  '/status',
  UserHandler.getUsersStatus
);

router.get(
  '/active-users',
  // validateRequest({
  //   body: z.object({
  //     filter: z.enum(['daily', 'weekly', 'monthly'])
  //   })
  // }),
  UserHandler.getActiveUsersByFilter
);

router.get(
  '/symptoms',
  UserHandler.getSymptomsByWeeks
)

router.get(
  '/checklists',
  UserHandler.getChecklistsByWeeks
)

router.get(
  '/specialists',
  UserHandler.getSpecialistsAdded
)

export default router;
