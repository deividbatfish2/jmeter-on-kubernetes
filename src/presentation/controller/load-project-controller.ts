import { HttpRequest, HttpResponse } from '../proptocols/http'

export class LoadProjectController {
  async handle (req: HttpRequest): Promise<HttpResponse> {
    const { name, description } = req.body
    if (!name || !description) { return { statusCode: 400 } }

    return { statusCode: 201 }
  }
}
