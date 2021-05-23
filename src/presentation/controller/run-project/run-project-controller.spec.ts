import { Validation } from '../../protocols/validation'
import { badRequest } from '../../utils/http-responses'
import { HttpRequest } from '../load-project/load-project-controller-protocols'
import { RunProjectController } from './run-project-controller'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}
interface SutTypes {
  validation: Validation
  runProjectController: RunProjectController
}
const makeSut = (): SutTypes => {
  const validation = makeValidation()
  const runProjectController = new RunProjectController(validation)

  return {
    validation, runProjectController
  }
}

describe('Run Project Controller', () => {
  describe('Valdations', () => {
    test('Should call validation with correct values', async () => {
      const { runProjectController, validation } = makeSut()

      const validateSpy = jest.spyOn(validation, 'validate')

      const httpRequest: HttpRequest = {
        body: {
          anyField: 'any value'
        }
      }

      await runProjectController.handle(httpRequest)

      expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('Should return 400 (bad request) if validation returns error', async () => {
      const { runProjectController, validation } = makeSut()
      jest.spyOn(validation, 'validate').mockImplementationOnce((input: any) => new Error('Any error'))

      const httpRequest: HttpRequest = {
        body: {
          anyField: 'any value'
        }
      }

      const result = await runProjectController.handle(httpRequest)
      expect(result).toStrictEqual(badRequest(new Error('Any error')))
    })
  })
})
