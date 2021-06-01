import { ProjectInProgressError } from '../../../domain/error/project-in-progress-error'
import { ProjectNotFindedError } from '../../../domain/error/project-not-find-error'
import { Provider } from '../../../domain/models/jmx-provider'
import { LoadProjectModel } from '../../../domain/models/load-project-model'
import { StatusProject } from '../../../domain/models/status-project'
import { JmxProviderFactory } from '../../protocols/jmx-provider/jmx-provider-factory'
import { JmxProvider } from '../../protocols/jmx-provider/JmxProvider'
import { FindLoadProjectByIdRepository } from '../../protocols/load-project/find-load-project-by-id-repository'
import { DbRunLoadProject } from './db-run-load-project'

const makeDefaultReturnOfProject = (): LoadProjectModel => (
  {
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
)
const makeFindLoadProjectByIdRepositoryStub = (): FindLoadProjectByIdRepository => {
  class FindLoadProjectByIdRepositoryStub implements FindLoadProjectByIdRepository {
    async findLoadProjectById (id: string): Promise<LoadProjectModel> {
      return makeDefaultReturnOfProject()
    }
  }
  return new FindLoadProjectByIdRepositoryStub()
}
const makeJmxProviderStub = (): JmxProvider => {
  class JmxProviderStub implements JmxProvider {
    async getProject (specificFields: any): Promise<void> {

    }
  }
  return new JmxProviderStub()
}

const makeJmxProviderFactoryStub = (): JmxProviderFactory => {
  class JmxProviderFactoryStub implements JmxProviderFactory {
    getJmxProvider (provider: Provider): JmxProvider {
      return makeJmxProviderStub()
    }
  }
  return new JmxProviderFactoryStub()
}

interface SutTypes {
  dbRunLoadProject: DbRunLoadProject
  findLoadProjectByIdRepositoryStub: FindLoadProjectByIdRepository
  jmxProviderFactoryStub: JmxProviderFactory
}

const makeSut = (): SutTypes => {
  const findLoadProjectByIdRepositoryStub = makeFindLoadProjectByIdRepositoryStub()
  const jmxProviderFactoryStub = makeJmxProviderFactoryStub()
  const dbRunLoadProject = new DbRunLoadProject(findLoadProjectByIdRepositoryStub, jmxProviderFactoryStub)
  return {
    dbRunLoadProject, findLoadProjectByIdRepositoryStub, jmxProviderFactoryStub
  }
}
describe('K8s Run Project', () => {
  describe('FindLoadProjectById', () => {
    test('should call FindLoadProjectByIdRepository with correct values', async () => {
      const { dbRunLoadProject, findLoadProjectByIdRepositoryStub } = makeSut()
      const findLoadProjectByIdSpy = jest.spyOn(findLoadProjectByIdRepositoryStub, 'findLoadProjectById')
      await dbRunLoadProject.run({ idProject: 'any_id', qtdRunners: 2 })
      expect(findLoadProjectByIdSpy).toHaveBeenCalledWith('any_id')
    })

    test('should return a ProjectNotFindError if FindLoadProjectByIdRepository returns null', async () => {
      const { dbRunLoadProject, findLoadProjectByIdRepositoryStub } = makeSut()
      jest.spyOn(findLoadProjectByIdRepositoryStub, 'findLoadProjectById')
        .mockImplementationOnce(() => null)
      const result = await dbRunLoadProject.run({ idProject: 'any_id', qtdRunners: 2 })
      expect(result).toStrictEqual(new ProjectNotFindedError('any_id'))
    })

    test('should return a ProjectInProgressError if project status equals to running', async () => {
      const { dbRunLoadProject, findLoadProjectByIdRepositoryStub } = makeSut()
      jest.spyOn(findLoadProjectByIdRepositoryStub, 'findLoadProjectById')
        .mockImplementationOnce(async () => ({ ...makeDefaultReturnOfProject(), ...{ status: StatusProject.RUNNING } }))
      const result = await dbRunLoadProject.run({ idProject: 'any_id', qtdRunners: 2 })
      expect(result).toStrictEqual(new ProjectInProgressError('any_id'))
    })

    test('should throw if FindLoadProjectByIdRepository throws', async () => {
      const { dbRunLoadProject, findLoadProjectByIdRepositoryStub } = makeSut()
      jest.spyOn(findLoadProjectByIdRepositoryStub, 'findLoadProjectById')
        .mockImplementationOnce(() => { throw new Error('any error') })
      const result = dbRunLoadProject.run({ idProject: 'any_id', qtdRunners: 2 })
      await expect(result).rejects.toThrow(new Error('any error'))
    })
  })

  describe('JmxProviderFactory', () => {
    test('should call JmxProviderFactory with correct provider', async () => {
      const { dbRunLoadProject, jmxProviderFactoryStub } = makeSut()
      const getJmxProviderSpy = jest.spyOn(jmxProviderFactoryStub, 'getJmxProvider')

      await dbRunLoadProject.run({ idProject: 'any_id', qtdRunners: 2 })

      expect(getJmxProviderSpy).toHaveBeenCalledWith(Provider.GIT)
    })
  })
})
