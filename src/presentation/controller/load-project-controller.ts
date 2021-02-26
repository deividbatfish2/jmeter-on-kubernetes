import { HttpResponse } from '../proptocols/http'

export class LoadProjectController {
  async handle (): Promise<HttpResponse> {
    return { statusCode: 400 }
  }
}
