export class ResponseError extends Error {
  name: string = 'ResponseError'
  id: number
  url: string
  status: number
  message: string
  description?: string

  constructor(description?: string) {
    super()
    if (description) this.description = description
  }
}

export class BadRequest extends ResponseError {
  status = 400
  message = '👎 Bad request'
}

export class NotAuthorized extends ResponseError {
  status = 401
  message = '🙅‍♂️ Not authorized'
}

export class Denied extends ResponseError {
  status = 403
  message = '✋ Denied'
}

export class NotFound extends ResponseError {
  status = 404
  message = '🤷‍♂️ Not found'
}

export class NotAcceptable extends ResponseError {
  status = 406
  message = '👀 What is it?'
}

export class Conflict extends ResponseError {
  status = 409
  message = '🙅‍♂️ Already exists'
}
