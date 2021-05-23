import { Provider } from '../../../domain/models/jmx-provider'
import { LoadProjectModel } from '../../../domain/models/load-project-model'
import { StatusProject } from '../../../domain/models/status-project'
import { FindLoadProjectByIdRepository } from '../../protocols/load-project/find-load-project-by-id-repository'
import { DbRunLoadProject } from './db-run-load-project'

describe('K8s Run Project', () => {
  describe('FindLoadProjectById', () => {
    test('should call FindLoadProjectByIdRepository with correct values', async () => {
      class FindLoadProjectByIdRepositoryStub implements FindLoadProjectByIdRepository {
        async findLoadProjectById (id: string): Promise<LoadProjectModel> {
          return {
            command: 'any command',
            description: 'any description',
            id: 'any_id',
            jmxProvider: {
              provider: Provider.GIT,
              specificFields: {}
            },
            name: 'Any Project',
            status: StatusProject.STOPED
          }
        }
      }
      const findLoadProjectByIdRepositoryStub = new FindLoadProjectByIdRepositoryStub()
      const dbRunLoadProject = new DbRunLoadProject(findLoadProjectByIdRepositoryStub)
      const findLoadProjectByIdSpy = jest.spyOn(findLoadProjectByIdRepositoryStub, 'findLoadProjectById')
      await dbRunLoadProject.run({ idProject: 'any_id', qtdRunners: 2 })
      expect(findLoadProjectByIdSpy).toHaveBeenCalledWith('any_id')
    })
  })
})
