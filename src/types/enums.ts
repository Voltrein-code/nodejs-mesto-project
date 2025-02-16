/* eslint-disable no-unused-vars */
export enum TodoMethod {
  ADD = '$addToSet',
  REMOVE = '$pull',
}

export enum HttpStatusCode {
  ServerError = 500,
  NotFoundError = 404,
  BadRequestError = 400,
  Created = 201,
}
