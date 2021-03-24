import { JmxProvider } from '../../domain/models/jmx-provider'
import { AddLoadProject } from '../../domain/usecases/load-project/add-load-project'
import { InvalidFieldError } from '../error/invalid-field-error'
import { RequiredFieldError } from '../error/required-field-error'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { badRequest, created, serverError } from '../utils/http-responses'

export class LoadProjectController {
  constructor (private readonly addLoadProject: AddLoadProject) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['name', 'description', 'jmxProvider', 'command']

    for (const field of requiredFields) {
      if (!req.body[field]) { return badRequest(new RequiredFieldError(field)) }
    }

    const { name, description, jmxProvider, command } = req.body

    if (!Object.values(JmxProvider).includes(jmxProvider)) { return badRequest(new InvalidFieldError('jmxProvider')) }

    try {
      await this.addLoadProject.add({ name, description, jmxProvider, command })
      return created()
    } catch (e) {
      return serverError()
    }
  }
}
