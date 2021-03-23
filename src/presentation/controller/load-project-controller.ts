import { AddLoadProject } from '../../domain/usecases/load-project/add-load-project'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class LoadProjectController {
  constructor (private readonly addLoadProject: AddLoadProject) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const { name, description, jmxProvider, command } = req.body
    if (!name || !description || !jmxProvider || !command) { return { statusCode: 400 } }

    await this.addLoadProject.add({ name, description, jmxProvider, command })
    return { statusCode: 201 }
  }
}
