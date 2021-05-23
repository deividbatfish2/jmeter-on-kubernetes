import { Controller } from '../../protocols/controller'
import { Validation } from '../../protocols/validation'
import { HttpRequest, HttpResponse } from '../load-project/load-project-controller-protocols'

export class RunProjectController implements Controller {
  constructor (
    private readonly validationComposite: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    this.validationComposite.validate(body)
    return null
  }
}
