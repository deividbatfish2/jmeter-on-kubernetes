import { ProjectCanNotBeLoadedError } from '../../../domain/error/project-can-not-be-loaded'
import { ProjectInProgressError } from '../../../domain/error/project-in-progress-error'
import { ProjectNotFindedError } from '../../../domain/error/project-not-find-error'
import { Provider } from '../../../domain/models/jmx-provider'
import { LoadProjectModel } from '../../../domain/models/load-project-model'
import { StatusProject } from '../../../domain/models/status-project'
import { JmxProviderFactory } from '../../protocols/jmx-provider/jmx-provider-factory'
import { JmxProvider } from '../../protocols/jmx-provider/JmxProvider'
import { FindLoadProjectByIdRepository } from '../../protocols/load-project/find-load-project-by-id-repository'
import { Runner, RunnerModel } from '../../protocols/runner/runner'
import { DbRunLoadProject } from './db-run-load-project'

const makeDefaultReturnOfProject = (): LoadProjectModel => (
  {
    command: 'any command',
    description: 'any description',
    id: 'any_id',
    jmxProvider: {
      provider: Provider.GIT,
      specificFields: {
        anyField: 'any value'
      }
    },
    name: 'Any Project',
    status: StatusProject.STOPED
  }
)
const makeFindLoadProjectByIdRepositoryStub = (): FindLoadProjectByIdRepository => {
  class FindLoadProjectByIdRepositoryStub implements FindLoadProjectByIdRepository {
    async findLoadProjectById(id: string): Promise<LoadProjectModel> {
      return makeDefaultReturnOfProject()
    }
  }
  return new FindLoadProjectByIdRepositoryStub()
}
const makeJmxProviderStub = (): JmxProvider => {
  class JmxProviderStub implements JmxProvider {
    async getProject(specificFields: any): Promise<string | Error> { return 'any path' }
  }
  return new JmxProviderStub()
}

interface JmxTypes {
  jmxProviderFactoryStub: JmxProviderFactory
  jmxProviderStub: JmxProvider
}

const makeJmxProviderFactoryStub = (): JmxTypes => {
  const jmxProviderStub = makeJmxProviderStub()
  class JmxProviderFactoryStub implements JmxProviderFactory {
    getJmxProvider(provider: Provider): JmxProvider {
      return jmxProviderStub
    }
  }
  const jmxProviderFactoryStub = new JmxProviderFactoryStub()
  return {
    jmxProviderFactoryStub, jmxProviderStub
  }
}

const makeRunnerStub = (): Runner => {
  class RunnerStub implements Runner {
    async runProject(runnerModel: RunnerModel): Promise<void> {
      return
    }
  }
  return new RunnerStub()
}

interface SutTypes {
  dbRunLoadProject: DbRunLoadProject
  findLoadProjectByIdRepositoryStub: FindLoadProjectByIdRepository
  jmxProviderFactoryStub: JmxProviderFactory
  jmxProviderStub: JmxProvider
  runnerStub: Runner
}

const makeSut = (): SutTypes => {
  const findLoadProjectByIdRepositoryStub = makeFindLoadProjectByIdRepositoryStub()
  const { jmxProviderFactoryStub, jmxProviderStub } = makeJmxProviderFactoryStub()
  const runnerStub = makeRunnerStub()
  const dbRunLoadProject = new DbRunLoadProject(findLoadProjectByIdRepositoryStub, jmxProviderFactoryStub, runnerStub)
  return {
    dbRunLoadProject, findLoadProjectByIdRepositoryStub, jmxProviderFactoryStub, jmxProviderStub, runnerStub
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

  describe('JmxProvider', () => {
    test('should call JmxProvider with correct values', async () => {
      const { dbRunLoadProject, jmxProviderStub } = makeSut()
      const getProjectSpy = jest.spyOn(jmxProviderStub, 'getProject')

      await dbRunLoadProject.run({ idProject: 'any_id', qtdRunners: 2 })

      expect(getProjectSpy).toBeCalledWith(makeDefaultReturnOfProject().jmxProvider.specificFields)
    })

    test('should return a ProjectCanNotBeLoaded if JmxProvider returns error', async () => {
      const { dbRunLoadProject, jmxProviderStub } = makeSut()
      jest.spyOn(jmxProviderStub, 'getProject')
        .mockImplementationOnce(async () => new ProjectCanNotBeLoadedError('any_id'))

      const result = await dbRunLoadProject.run({ idProject: 'any_id', qtdRunners: 2 })

      expect(result).toStrictEqual(new ProjectCanNotBeLoadedError('any_id'))
    })

    test('should throws if JmxProvider throws', async () => {
      const { dbRunLoadProject, jmxProviderStub } = makeSut()
      jest.spyOn(jmxProviderStub, 'getProject')
        .mockImplementationOnce(() => { throw new Error('Any error') })

      const result = dbRunLoadProject.run({ idProject: 'any_id', qtdRunners: 2 })

      await expect(result).rejects.toThrow(new Error('Any error'))
    })
  })

  describe('Runner', () => {
    test('Shold call Runner with correct values', async () => {
      const { dbRunLoadProject, runnerStub } = makeSut()
      const runProjectSpy = jest.spyOn(runnerStub, 'runProject')

      await dbRunLoadProject.run({ idProject: 'any_id', qtdRunners: 2 })

      expect(runProjectSpy).toHaveBeenCalledWith({ pathOfProject: 'any path', totalOfRunners: 2 })
    })

    test('', async () => {
      
    })
  })
})
