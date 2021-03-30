import { AddLoadProjectModel, Provider, LoadProjectModel } from '../../../presentation/controller/load-project-controller-protocols'
import { AddLoadProjectRepository } from '../../protocols/load-project/add-load-project-repository'
import { DbAddLoadProject } from './db-add-load-project'

const makeFakeLoadProjectModel = (): LoadProjectModel => ({
  id: 'any_id',
  name: 'Any Name',
  description: 'Any description',
  jmxProvider: {
    provider: Provider.GIT,
    specificFields: {
      path: 'any_path'
    }
  },
  command: 'any command'
})

const makeFakeAddLoadProjectModel = (): AddLoadProjectModel => ({
  name: 'Any Name',
  description: 'Any description',
  jmxProvider: {
    provider: Provider.GIT,
    specificFields: {
      path: 'any_path'
    }
  },
  command: 'any command'
})

const makeAddLoadProjectRepositoryStub = (): AddLoadProjectRepository => {
  class AddLoadProjectRepositoryStub implements AddLoadProjectRepository {
    async add (addLoadProject: AddLoadProjectModel): Promise<LoadProjectModel> {
      return makeFakeLoadProjectModel()
    }
  }
  return new AddLoadProjectRepositoryStub()
}

interface SutTypes {
  addLoadProjectRepositoryStub: AddLoadProjectRepository
  sut: DbAddLoadProject
}

const makeSut = (): SutTypes => {
  const addLoadProjectRepositoryStub = makeAddLoadProjectRepositoryStub()
  const sut = new DbAddLoadProject(addLoadProjectRepositoryStub)

  return {
    sut, addLoadProjectRepositoryStub
  }
}

describe('DbAddLoadProject UseCase', () => {
  test('Should call AddLoadProjectRepository with correct values', async () => {
    const { sut, addLoadProjectRepositoryStub } = makeSut()

    const addStub = jest.spyOn(addLoadProjectRepositoryStub, 'add')

    await sut.add(makeFakeAddLoadProjectModel())

    expect(addStub).toHaveBeenCalledWith(makeFakeAddLoadProjectModel())
  })

  test('Should throws if AddLoadProjectRepository throws', async () => {
    const { sut, addLoadProjectRepositoryStub } = makeSut()
    jest.spyOn(addLoadProjectRepositoryStub, 'add')
      .mockImplementationOnce(() => { throw new Error() })

    const result = sut.add(makeFakeAddLoadProjectModel())
    await expect(result).rejects.toThrowError()
  })

  test('Should return a LoadProject on success', async () => {
    const { sut } = makeSut()
    const result = await sut.add(makeFakeAddLoadProjectModel())
    expect(result).toStrictEqual(makeFakeLoadProjectModel())
  })
})