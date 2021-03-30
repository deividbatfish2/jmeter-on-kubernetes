import { Controller } from '../../presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '../../presentation/protocols/http'
import { adaptRoute } from './adpt-route'
import { Request, Response } from 'express'

const makeReqStub = (): Request => {
  const req = {
    body: {
      propriedade: 'any property'
    }
  }
  return req as Request
}
const makeResStub = (): Response => {
  const res = {
    status: (statucCode: number) => res,
    json: (anyJson: {}) => res
  }
  return res as Response
}
const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return {
        statusCode: 201
      }
    }
  }
  return new ControllerStub()
}

interface SutTypes {
  sut: Function
  controllerStub: Controller
  resStub: Response
  reqStub: Request
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const reqStub = makeReqStub()
  const resStub = makeResStub()
  const sut = adaptRoute
  return {
    sut, controllerStub, resStub, reqStub
  }
}
describe('Adapt Route', () => {
  test('Should call status with correct value on httpRequest statusCode 500', async () => {
    const { sut, controllerStub, resStub, reqStub } = makeSut()

    jest.spyOn(controllerStub, 'handle')
      .mockImplementationOnce(async () => await new Promise<HttpResponse>(resolve => resolve({ statusCode: 500, body: { message: 'any message' } })))

    const statusSpy = jest.spyOn(resStub, 'status')

    const handle = sut(controllerStub)

    await handle(reqStub, resStub)

    expect(statusSpy).toHaveBeenCalledWith(500)
  })
})
