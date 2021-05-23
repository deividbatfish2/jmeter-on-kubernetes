import { Validation } from '../../protocols/validation'
import { HttpRequest } from '../load-project/load-project-controller-protocols'
import { RunProjectController } from './run-project-controller'

describe('Run Project Controller', () => {
  describe('Valdations', () => {
    test('Should call validation with correct values', async () => {
      class ValidationStub implements Validation {
        validate (input: any): Error {
          return null
        }
      }
      const validation = new ValidationStub()
      const runProjectController = new RunProjectController(validation)

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
