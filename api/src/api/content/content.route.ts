import { Router } from 'express'
import { validateAuthentication, validateRequest } from '../../middlewares'
import * as ContentHandler from './content.handler'
import { z } from 'zod'

const router = Router()

router.post(
  '/', 
  validateAuthentication, 
  validateRequest({
    body: z.object({
      contentId: z.string()
    }),
  }),
  ContentHandler.setVideoHistory
)

router.get(
    '/',
    validateAuthentication,
    ContentHandler.getContent
)

router.get(
  '/symptom/:symptom',
  validateAuthentication,
  ContentHandler.getContentForSymptom
)


export default router
