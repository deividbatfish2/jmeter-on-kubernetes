import { Validation } from '../../protocols/validation'
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
  })
})
