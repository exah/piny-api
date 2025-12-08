import { pino, type Level } from 'pino'

function getLevel(): Level {
  if (process.env.NODE_ENV === 'test') {
    return 'error'
  }

  if (process.env.DEBUG === '*' || process.env.DEBUG === 'piny') {
    return 'debug'
  }

  return 'info'
}

export const logger = pino({
  depthLimit: 10,
  formatters: { level: (label) => ({ level: label }), bindings: () => ({}) },
  level: getLevel(),
})
