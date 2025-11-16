export const Privacy = {
  public: 'public',
  private: 'private',
} as const

export type Privacy = keyof typeof Privacy

export const State = {
  active: 'active',
  removed: 'removed',
} as const

export type State = keyof typeof State
