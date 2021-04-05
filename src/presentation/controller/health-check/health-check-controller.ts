import { Controller } from '../../protocols/controller'
import { DateHelper } from '../../utils/date/date-helper-protocol'
import { ok } from '../../utils/http-responses'
import { HttpRequest, HttpResponse } from '../load-project/load-project-controller-protocols'

export class HealthCheckController implements Controller {
  constructor (private readonly dateHelper: DateHelper) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return ok({ timestamp: 1617664390886 })
  }
}
