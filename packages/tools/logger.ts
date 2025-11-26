import { pino } from 'pino'
import pretty from 'pino-pretty'

export const logger = pino({ depthLimit: 10 }, pretty())
