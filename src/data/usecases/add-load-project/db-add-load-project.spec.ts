import { AddLoadProjectModel, Provider, LoadProjectModel } from '../../../presentation/controller/load-project-controller-protocols'
import { AddLoadProjectRepository } from '../../protocols/load-project/add-load-project-repository'
import { FindLoadProjectByNameRepository } from '../../protocols/load-project/FindLoadProjectByNameRepository'
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

const makeFindLoadProjectByNameRepositoryStub = (): FindLoadProjectByNameRepository => {
  class FindLoadProjectByNameRepositoryStub implements FindLoadProjectByNameRepository {
    async findLoadProjectByName (name: string): Promise<LoadProjectModel> {
      return null
    }
  }
  return new FindLoadProjectByNameRepositoryStub()
}

interface SutTypes {
  findLoadProjectByNameRepositoryStub: FindLoadProjectByNameRepository
  addLoadProjectRepositoryStub: AddLoadProjectRepository
  sut: DbAddLoadProject
}

const makeSut = (): SutTypes => {
  const findLoadProjectByNameRepositoryStub = makeFindLoadProjectByNameRepositoryStub()
  const addLoadProjectRepositoryStub = makeAddLoadProjectRepositoryStub()
  const sut = new DbAddLoadProject(addLoadProjectRepositoryStub, findLoadProjectByNameRepositoryStub)

  return {
    sut, addLoadProjectRepositoryStub, findLoadProjectByNameRepositoryStub
  }
}

describe('DbAddLoadProject UseCase', () => {
  describe('FindLoadProjectByNameRepository', () => {
    test('Should call FindLoadProjectByNameRepository with correct name', async () => {
      const { sut, findLoadProjectByNameRepositoryStub } = makeSut()

      const addStub = jest.spyOn(findLoadProjectByNameRepositoryStub, 'findLoadProjectByName')

      await sut.add(makeFakeAddLoadProjectModel())

      expect(addStub).toHaveBeenCalledWith(makeFakeAddLoadProjectModel().name)
    })

    test('Should throws if FindLoadProjectByNameRepository throws', async () => {
      const { sut, findLoadProjectByNameRepositoryStub } = makeSut()
      jest.spyOn(findLoadProjectByNameRepositoryStub, 'findLoadProjectByName')
        .mockImplementationOnce(() => { throw new Error() })

      const result = sut.add(makeFakeAddLoadProjectModel())
      await expect(result).rejects.toThrowError()
    })

    test('Should retunr null if FindLoadProjectByNameRepository returns a load project', async () => {
      const { sut, findLoadProjectByNameRepositoryStub } = makeSut()
      jest.spyOn(findLoadProjectByNameRepositoryStub, 'findLoadProjectByName')
        .mockImplementationOnce(async () => makeFakeLoadProjectModel())

      const result = await sut.add(makeFakeAddLoadProjectModel())
      expect(result).toBeNull()
    })
  })

  describe('AddLoadProjectRepository', () => {
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
  })

  test('Should return a LoadProject on success', async () => {
    const { sut } = makeSut()
    const result = await sut.add(makeFakeAddLoadProjectModel())
    expect(result).toStrictEqual(makeFakeLoadProjectModel())
  })
})
