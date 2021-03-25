import { AddLoadProjectModel, JmxProvider, LoadProjectModel } from '../../../presentation/controller/load-project-controller-protocols'
import { AddLoadProjectRepository } from '../../protocols/load-project/add-load-project-repository'
import { DbAddLoadProject } from './db-add-load-project'

const makeFakeLoadProjectModel = (): LoadProjectModel => ({
  id: 'any_id',
  name: 'Any Name',
  description: 'Any description',
  jmxProvider: JmxProvider.GIT,
  command: 'any command'
})

const makeFakeAddLoadProjectModel = (): AddLoadProjectModel => ({
  name: 'Any Name',
  description: 'Any description',
  jmxProvider: JmxProvider.GIT,
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

  test.todo('Should throws if AddLoadProjectRepository throws')

  test.todo('Should return a LoadProject on success')
})
