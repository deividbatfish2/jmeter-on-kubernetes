import { RunLoadProject, RunLoadProjectModel } from '../../../domain/usecases/load-project/run-load-project'
import { Validation } from '../../protocols/validation'
import { badRequest } from '../../utils/http-responses'
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
    test('Should call validation with correct values', async () => {
      const { runProjectController, validation } = makeSut()

      const validateSpy = jest.spyOn(validation, 'validate')

      const httpRequest = makeHttpRequest()

      await runProjectController.handle(httpRequest)

      expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('Should return 400 (bad request) if validation returns error', async () => {
      const { runProjectController, validation } = makeSut()
      jest.spyOn(validation, 'validate').mockImplementationOnce((input: any) => new Error('Any error'))

      const httpRequest = makeHttpRequest()

      const result = await runProjectController.handle(httpRequest)
      expect(result).toStrictEqual(badRequest(new Error('Any error')))
    })
  })

  describe('Run Load Project Use case', () => {
    test('Should call RunLoadProject with correct values', async () => {
      const { runProjectController, runProjectStub } = makeSut()
      const runSpy = jest.spyOn(runProjectStub, 'run')
      const httpRequest = makeHttpRequest()
      await runProjectController.handle(httpRequest)

      expect(runSpy).toHaveBeenLastCalledWith({
        idProject: 'any-id',
        qtdRunners: 2
      })
    })
  })
})
