import { Router } from 'express'
import { validateAuthentication, validateRequest } from '../../middlewares'
import * as MentalHealthHandler from './mentalHealth.handler'
import { z } from 'zod'

const router = Router()

router.post(
    "/",
    validateAuthentication,
    validateRequest({
        body: z.object({
            emotion: z.string(),
            description: z.string()
        })
    }),
    MentalHealthHandler.saveMentalhealth
)

router.get(
    "/partner",
    validateAuthentication,
    MentalHealthHandler.getPartnerInfo
)

export default router