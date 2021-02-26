import { HttpRequest, HttpResponse } from '../proptocols/http'

export class LoadProjectController {
  async handle (req: HttpRequest): Promise<HttpResponse> {
    return { statusCode: 400 }
  }
}
