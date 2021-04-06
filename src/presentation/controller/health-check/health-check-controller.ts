import { Controller } from '../../protocols/controller'
import { IDateHelper } from '../../utils/date/date-helper-protocol'
import { ok, serverError } from '../../utils/http-responses'
import { HttpRequest, HttpResponse } from '../load-project/load-project-controller-protocols'

export class HealthCheckController implements Controller {
  constructor (private readonly dateHelper: IDateHelper) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const timestamp = this.dateHelper.now()
      return ok({ timestamp })
    } catch (e) {
      return serverError()
    }
  }
}
