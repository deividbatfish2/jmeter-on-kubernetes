import { Provider, LoadProjectModel, AddLoadProject, AddLoadProjectModel, HttpRequest } from './load-project-controller-protocols'
import { badRequest, created, serverError } from '../../utils/http-responses'
import { LoadProjectController } from './load-project-controller'
import { RequiredFieldError } from '../../error/required-field-error'
import { InvalidFieldError } from '../../error/invalid-field-error'
import { ProjectNameInUse } from '../../error/project-name-in-use-error'
import { StatusProject } from '../../../domain/models/status-project'

const makeFakeRequest = (): HttpRequest => ({
  body: { name: 'Any Name', description: 'Any description', jmxProvider: { provider: Provider.GIT, specificFields: { path: 'any_path' } }, command: 'any command' }
})

const makeAddLoadProjectStub = (): AddLoadProject => {
  class AddLoadProjectStub implements AddLoadProject {
    async add (addLoadProjectModel: AddLoadProjectModel): Promise<LoadProjectModel> {
      return {
        id: 'any_id',
        name: 'any_name',
        description: 'any description',
        status: StatusProject.STOPED,
        jmxProvider: { provider: Provider.GIT, specificFields: { path: 'any_path' } },
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
    test('should return 400 (badReuqest) if name is not provided', async () => {
      const { sut } = makeSut()
      const { body: { name, ...requestWithoutName } } = makeFakeRequest()
      const result = await sut.handle({ body: requestWithoutName })
      expect(result).toStrictEqual(badRequest(new RequiredFieldError('name')))
    })

    test('should return 400 (badReuqest) if description is not provided', async () => {
      const { sut } = makeSut()
      const { body: { description, ...requestWithoutDescription } } = makeFakeRequest()
      const result = await sut.handle({ body: requestWithoutDescription })
      expect(result).toStrictEqual(badRequest(new RequiredFieldError('description')))
    })

    test('should return 400 (badReuqest) if jmxProvider is not provided', async () => {
      const { sut } = makeSut()
      const { body: { jmxProvider, ...requestWithoutJmxProvider } } = makeFakeRequest()
      const result = await sut.handle({ body: requestWithoutJmxProvider })
      expect(result).toStrictEqual(badRequest(new RequiredFieldError('jmxProvider')))
    })

    test('should return 400 (badReuqest) if jmxProvider is not recognized', async () => {
      const { sut } = makeSut()
      const httpRequest = { ...makeFakeRequest().body, ...{ jmxProvider: 'ANY_JMX_PROVIDER' } }
      const result = await sut.handle({ body: httpRequest })
      expect(result).toStrictEqual(badRequest(new InvalidFieldError('jmxProvider')))
    })

    test('should return 400 (badReuqest) if command is not provided', async () => {
      const { sut } = makeSut()
      const { body: { command, ...requestWithoutCommand } } = makeFakeRequest()
      const result = await sut.handle({ body: requestWithoutCommand })
      expect(result).toStrictEqual(badRequest(new RequiredFieldError('command')))
    })
  })

  describe('AddLoadProject', () => {
    test('Should calls AddLoadProject with correct values', async () => {
      const { sut, addLoadProjectStub } = makeSut()
      const addSpy = jest.spyOn(addLoadProjectStub, 'add')
      await sut.handle(makeFakeRequest())
      expect(addSpy).toHaveBeenCalledWith(makeFakeRequest().body)
    })

    test('Should return a ProjectNameInUseError if AddLoadProject returns null', async () => {
      const { sut, addLoadProjectStub } = makeSut()
      jest.spyOn(addLoadProjectStub, 'add')
        .mockImplementationOnce(async () => null)
      const result = await sut.handle(makeFakeRequest())
      expect(result).toStrictEqual(badRequest(new ProjectNameInUse()))
    })

    test('Should return 500 (serverError) if AddLoadProject throws', async () => {
      const { sut, addLoadProjectStub } = makeSut()
      jest.spyOn(addLoadProjectStub, 'add')
        .mockImplementationOnce(() => { throw new Error() })
      const result = await sut.handle(makeFakeRequest())
      expect(result).toStrictEqual(serverError())
    })
  })

  describe('Sucess', () => {
    test('Should return 201 (created) on success', async () => {
      const { sut } = makeSut()
      const result = await sut.handle(makeFakeRequest())
      expect(result).toStrictEqual(created())
    })
  })
})
