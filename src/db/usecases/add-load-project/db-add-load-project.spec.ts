import { AddLoadProjectModel, JmxProvider, LoadProjectModel } from '../../../presentation/controller/load-project-controller-protocols'
import { AddLoadProjectRepository } from '../../protocols/load-project/add-load-project-repository'
import { DbAddLoadProject } from './db-add-load-project'

describe('DbAddLoadProject UseCase', () => {
  test('Should call AddLoadProjectRepository with correct values', async () => {
    class AddLoadProjectRepositoryStub implements AddLoadProjectRepository {
      async add (addLoadProject: AddLoadProjectModel): Promise<LoadProjectModel> {
        return {
          id: 'any_id',
          name: 'Any Name',
          description: 'Any description',
          jmxProvider: JmxProvider.GIT,
          command: 'any command'
        }
      }
    }

    const addLoadProjectRepositoryStub = new AddLoadProjectRepositoryStub()
    const sut = new DbAddLoadProject(addLoadProjectRepositoryStub)

    const addStub = jest.spyOn(addLoadProjectRepositoryStub, 'add')

    await sut.add({
      name: 'Any Name',
      description: 'Any description',
      jmxProvider: JmxProvider.GIT,
      command: 'any command'
    })

    expect(addStub).toHaveBeenCalledWith({
      name: 'Any Name',
      description: 'Any description',
      jmxProvider: JmxProvider.GIT,
      command: 'any command'
    })
  })

  test.todo('Should throws if AddLoadProjectRepository throws')

  test.todo('Should return a LoadProject on success')
})
