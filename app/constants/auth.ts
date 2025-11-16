export const AuthType = {
  pass: 'pass',
} as const

export type AuthType = keyof typeof AuthType
