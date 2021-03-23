import { HttpResponse } from '../protocols/http'

export const created = (): HttpResponse => ({
  statusCode: 201
})
