export const DAY = 1000 * 60 * 60 * 24
export const WEEK = DAY * 7
export const MONTH = WEEK * 4

export enum AuthType {
  pass = 'pass',
}

export enum Privacy {
  public = 'public',
  private = 'private',
}

export enum State {
  active = 'active',
  removed = 'removed',
}
