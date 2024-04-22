import { Router } from "express";
import * as SpecialistHandler from './specialist.handler';
import { validateAuthentication, validateRequest } from "../../middlewares";
import { z } from 'zod';

const router = Router();

router.post(
    '/',
    validateAuthentication,
    validateRequest({
        body: z.object({
            specialistId: z.string()
        })
    }),
    SpecialistHandler.addSpecialist
);

router.delete(
    '/',
    validateAuthentication,
    validateRequest({
        body: z.object({
            specialistId: z.string()
        })
    }),
    SpecialistHandler.deleteSpecialist
);

router.get(
    '/',
    validateAuthentication,
    SpecialistHandler.getAllSpecialists
);

export default router;
