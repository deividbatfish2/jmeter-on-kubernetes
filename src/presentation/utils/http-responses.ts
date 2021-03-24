import { HttpResponse } from '../protocols/http'

export const created = (): HttpResponse => ({
  statusCode: 201
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error.message
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new Error('unexpected error').message
})
