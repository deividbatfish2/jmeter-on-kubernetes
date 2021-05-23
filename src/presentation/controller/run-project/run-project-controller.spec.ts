import { RunLoadProject, RunLoadProjectModel } from '../../../domain/usecases/load-project/run-load-project'
import { Validation } from '../../protocols/validation'
import { badRequest, serverError } from '../../utils/http-responses'
import { HttpRequest } from '../load-project/load-project-controller-protocols'
import { RunProjectController } from './run-project-controller'

const makeHttpRequest = (): HttpRequest => ({
  body: {
    qtdRunners: 2
  },
  path: {
    idproject: 'any-id'
  }
})
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeRunProjectUseCase = (): RunLoadProject => {
  class RunProjectStub implements RunLoadProject {
    async run (runLoadProjectModel: RunLoadProjectModel): Promise<Error> {
      return null
    }
  }
  return new RunProjectStub()
}
interface SutTypes {
  validation: Validation
  runProjectStub: RunLoadProject
  runProjectController: RunProjectController
}
const makeSut = (): SutTypes => {
  const validation = makeValidation()
  const runProjectStub = makeRunProjectUseCase()
  const runProjectController = new RunProjectController(validation, runProjectStub)

  return {
    runProjectController, validation, runProjectStub
  }
}

describe('Run Project Controller', () => {
  describe('Valdations', () => {
    test('should call validation with correct values', async () => {
      const { runProjectController, validation } = makeSut()

      const validateSpy = jest.spyOn(validation, 'validate')

      const httpRequest = makeHttpRequest()

      await runProjectController.handle(httpRequest)

      expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('should return 400 (bad request) if validation returns error', async () => {
      const { runProjectController, validation } = makeSut()
      jest.spyOn(validation, 'validate').mockImplementationOnce((input: any) => new Error('Any error'))

      const httpRequest = makeHttpRequest()

      const result = await runProjectController.handle(httpRequest)
      expect(result).toStrictEqual(badRequest(new Error('Any error')))
    })
  })

  describe('Run Load Project Use case', () => {
    test('should call RunLoadProject with correct values', async () => {
      const { runProjectController, runProjectStub } = makeSut()
      const runSpy = jest.spyOn(runProjectStub, 'run')
      const httpRequest = makeHttpRequest()
      await runProjectController.handle(httpRequest)

      expect(runSpy).toHaveBeenLastCalledWith({
        idProject: 'any-id',
        qtdRunners: 2
      })
    })

    test('shoud return badRequest if RunLoadProject returns error', async () => {
      const { runProjectController, runProjectStub } = makeSut()
      jest.spyOn(runProjectStub, 'run').mockImplementationOnce(async () => new Error('any error'))

      const result = await runProjectController.handle(makeHttpRequest())

      expect(result).toStrictEqual(badRequest(new Error('any error')))
    })

    test('should return 500 (serverError) if RunLoadProject throws', async () => {
      const { runProjectController, runProjectStub } = makeSut()
      jest.spyOn(runProjectStub, 'run').mockImplementationOnce(async () => { throw new Error('any error') })

      const result = await runProjectController.handle(makeHttpRequest())

      expect(result).toStrictEqual(serverError())
    })
  })
})
