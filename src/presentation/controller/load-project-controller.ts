import { Provider, AddLoadProject, HttpRequest, HttpResponse } from './load-project-controller-protocols'
import { InvalidFieldError } from '../error/invalid-field-error'
import { RequiredFieldError } from '../error/required-field-error'
import { badRequest, created, serverError } from '../utils/http-responses'
import { Controller } from '../protocols/controller'
import { ProjectNameInUse } from '../error/project-name-in-use-error'

export class LoadProjectController implements Controller {
  constructor (private readonly addLoadProject: AddLoadProject) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['name', 'description', 'jmxProvider', 'command']

    for (const field of requiredFields) {
      if (!req.body[field]) { return badRequest(new RequiredFieldError(field)) }
    }

    const { name, description, jmxProvider, command } = req.body

    if (!Object.values(Provider).includes(jmxProvider.provider)) { return badRequest(new InvalidFieldError('jmxProvider')) }

    try {
      const loadProjectAdded = await this.addLoadProject.add({ name, description, jmxProvider, command })
      if (!loadProjectAdded) {
        return badRequest(new ProjectNameInUse())
      }
      return created()
    } catch (e) {
      return serverError()
    }
  }
}
