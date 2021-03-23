import { JmxProvider } from '../../domain/models/jmx-provider'
import { LoadProjectModel } from '../../domain/models/load-project-model'
import { AddLoadProject, AddLoadProjectModel } from '../../domain/usecases/load-project/add-load-project'
import { LoadProjectController } from './load-project-controller'

const makeFakeRequest = (): any => ({
  body: { name: 'Any Name', description: 'Any description', jmxProvider: 'any_provider', command: 'any command' }
})

const makeAddLoadProjectStub = (): AddLoadProject => {
  class AddLoadProjectStub implements AddLoadProject {
    async add (addLoadProjectModel: AddLoadProjectModel): Promise<LoadProjectModel> {
      return {
        id: 'any_id',
        name: 'any_name',
        description: 'any description',
        jmxProvider: JmxProvider.GIT,
        command: 'any command'
      }
    }
  }
  return new AddLoadProjectStub()
}

interface SutTypes {
  sut: LoadProjectController
  addLoadProjectStub: AddLoadProject
}

const makeSut = (): SutTypes => {
  const addLoadProjectStub = makeAddLoadProjectStub()
  const sut = new LoadProjectController(addLoadProjectStub)

  return {
    sut, addLoadProjectStub
  }
}

describe('LoadProjectController', () => {
  describe('Validations', () => {
    test('should return 400 if name is not provided', async () => {
      const { sut } = makeSut()
      const { body: { name, ...requestWithoutName } } = makeFakeRequest()
      const result = await sut.handle({ body: requestWithoutName })
      expect(result.statusCode).toBe(400)
    })

    test('should return 400 if description is not provided', async () => {
      const { sut } = makeSut()
      const { body: { description, ...requestWithoutDescription } } = makeFakeRequest()
      const result = await sut.handle({ body: requestWithoutDescription })
      expect(result.statusCode).toBe(400)
    })

    test('should return 400 if jmxProvider is not provided', async () => {
      const { sut } = makeSut()
      const { body: { jmxProvider, ...requestWithoutJmxProvider } } = makeFakeRequest()
      console.log(requestWithoutJmxProvider)
      const result = await sut.handle({ body: requestWithoutJmxProvider })
      expect(result.statusCode).toBe(400)
    })

    test('should return 400 if command is not provided', async () => {
      const { sut } = makeSut()
      const { body: { command, ...requestWithoutCommand } } = makeFakeRequest()
      const result = await sut.handle({ body: requestWithoutCommand })
      expect(result.statusCode).toBe(400)
    })
  })

  describe('AddLoadProject', () => {
    test('Should calls AddLoadProject with correct values', async () => {
      const { sut, addLoadProjectStub } = makeSut()
      const addSpy = jest.spyOn(addLoadProjectStub, 'add')
      await sut.handle(makeFakeRequest())
      expect(addSpy).toHaveBeenCalledWith(makeFakeRequest().body)
    })

    test.todo('Should return 500 if AddLoadProject throws')
  })
})
