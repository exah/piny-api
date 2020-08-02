export const DAY = 1000 * 60 * 60 * 24
export const WEEK = DAY * 7
export const MONTH = WEEK * 4

export enum AuthType {
  pass = 'pass',
}

export enum BookmarkPrivacy {
  public = 'public',
  private = 'private',
}

export enum BookmarkState {
  active = 'active',
  removed = 'removed',
}

export const JSON_BODY = {
  contentTypes: {
    json: ['application/json'],
  },
}
