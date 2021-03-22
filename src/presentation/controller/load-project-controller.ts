import { HttpRequest, HttpResponse } from '../protocols/http'

export class LoadProjectController {
  async handle (req: HttpRequest): Promise<HttpResponse> {
    const { name, description, jmxProvider } = req.body
    if (!name || !description || !jmxProvider) { return { statusCode: 400 } }

    return { statusCode: 201 }
  }
}
