export const AuthType = {
  pass: 'pass',
} as const

export type AuthType = keyof typeof AuthType

export const SessionState = {
  pass: 'pass',
} as const

export type SessionState = keyof typeof SessionState
