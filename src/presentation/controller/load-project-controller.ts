import { JmxProvider } from '../../domain/models/jmx-provider'
import { AddLoadProject } from '../../domain/usecases/load-project/add-load-project'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { created } from '../utils/http-responses'

export class LoadProjectController {
  constructor (private readonly addLoadProject: AddLoadProject) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const { name, description, jmxProvider, command } = req.body
    if (!name || !description || !jmxProvider || !command) { return { statusCode: 400 } }

    if (!Object.values(JmxProvider).includes(jmxProvider)) { return { statusCode: 400 } }

    try {
      await this.addLoadProject.add({ name, description, jmxProvider, command })
      return created()
    } catch (e) {
      return { statusCode: 500 }
    }
  }
}
