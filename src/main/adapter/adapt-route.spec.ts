import { Controller } from '../../presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '../../presentation/protocols/http'
import { adaptRoute } from './adpt-route'
import { Request, Response } from 'express'

describe('Adapt Route', () => {
  test('Should call status with correct value on httpRequest statusCode 500', async () => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        return {
          statusCode: 500,
          body: {
            message: 'any message'
          }
        }
      }
    }

    const controllerStub = new ControllerStub()

    const res = {
      status: (statucCode: number) => res,
      json: (anyJson: {}) => res
    }

    const req = {
      body: {
        propriedade: 'any property'
      }
    }

    const statusSpy = jest.spyOn(res, 'status')

    const handle = adaptRoute(controllerStub)

    await handle(req as Request, res as Response)

    expect(statusSpy).toHaveBeenCalledWith(500)
  })
})
