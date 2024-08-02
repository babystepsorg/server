import { Router } from 'express'
import * as SymptomsHandler from './symptoms.handler'

const router = Router()

router.get(
    '/',
    SymptomsHandler.getSymptomsOfWeek
)

export default router