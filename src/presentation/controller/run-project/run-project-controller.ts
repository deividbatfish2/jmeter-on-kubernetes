import { RunLoadProject } from '../../../domain/usecases/load-project/run-load-project'
import { Controller } from '../../protocols/controller'
import { Validation } from '../../protocols/validation'
import { badRequest, serverError } from '../../utils/http-responses'
import { HttpRequest, HttpResponse } from '../load-project/load-project-controller-protocols'

export class RunProjectController implements Controller {
  constructor (
    private readonly validationComposite: Validation,
    private readonly runLoadProject: RunLoadProject
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body, path } = httpRequest
      const validationResult = this.validationComposite.validate(body)
      if (validationResult) {
        return badRequest(validationResult)
      }
      const loadProjectFails = await this.runLoadProject.run({
        qtdRunners: body.qtdRunners as number,
        idProject: path.idproject as string
      })

      if (loadProjectFails) {
        return badRequest(loadProjectFails)
      }
      return null
    } catch {
      return serverError()
    }
  }
}
