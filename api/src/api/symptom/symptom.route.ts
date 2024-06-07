import { Router } from "express";
import * as SymptomHandler from './symptom.handler'
import { validateAuthentication, validateRequest } from "../../middlewares";
import { z } from 'zod'

const router = Router()

router.get(
    '/',
    validateAuthentication,
    validateRequest({
        query: z.object({
            week: z.string().optional(),
            role: z.string().optional()
        })
    }),
    SymptomHandler.getSymptoms
)

router.post(
    '/',
    validateAuthentication,
    validateRequest({
        body: z.object({
            symptomId: z.string()
        })
    }),
    SymptomHandler.addSymptom
)

router.delete(
    '/',
    validateAuthentication,
    validateRequest({
        body: z.object({
            symptomId: z.string()
        })
    }),
    SymptomHandler.deleteSymptom
)
export default router
