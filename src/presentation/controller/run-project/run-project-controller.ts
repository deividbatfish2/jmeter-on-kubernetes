import { Controller } from '../../protocols/controller'
import { Validation } from '../../protocols/validation'
import { badRequest } from '../../utils/http-responses'
import { HttpRequest, HttpResponse } from '../load-project/load-project-controller-protocols'

export class RunProjectController implements Controller {
  constructor (
    private readonly validationComposite: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    const validationResult = this.validationComposite.validate(body)
    if (validationResult) {
      return badRequest(validationResult)
    }
    return null
  }
}
