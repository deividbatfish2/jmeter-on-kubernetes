import { ProjectCanNotBeLoadedError } from '../../../domain/error/project-can-not-be-loaded'
import { ProjectCanNotBeRunnerError } from '../../../domain/error/project-can-not-be-runner'
import { ProjectInProgressError } from '../../../domain/error/project-in-progress-error'
import { ProjectNotFindedError } from '../../../domain/error/project-not-find-error'
import { Provider } from '../../../domain/models/jmx-provider'
import { LoadProjectModel } from '../../../domain/models/load-project-model'
import { StatusProject } from '../../../domain/models/status-project'
import { JmxProviderFactory } from '../../protocols/jmx-provider/jmx-provider-factory'
import { JmxProvider } from '../../protocols/jmx-provider/JmxProvider'
import { FindLoadProjectByIdRepository } from '../../protocols/load-project/find-load-project-by-id-repository'
import { UpdateLoadProjecStatusModel, UpdateLoadProjectStatusRepository } from '../../protocols/load-project/update-load-project-status-repository'
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
    async runProject(runnerModel: RunnerModel): Promise<Error> {
      return
    }
  }
  return new RunnerStub()
}

const makeUpdateLoadProjectStatusRepositoryStub = (): UpdateLoadProjectStatusRepository => {
  class UpdateLoadProjectStatusStub implements UpdateLoadProjectStatusRepository {
    async updateStatus({ id, status }: UpdateLoadProjecStatusModel): Promise<void> {
      return
    }
  }
  return new UpdateLoadProjectStatusStub()
}

interface SutTypes {
  dbRunLoadProject: DbRunLoadProject
  findLoadProjectByIdRepositoryStub: FindLoadProjectByIdRepository
  jmxProviderFactoryStub: JmxProviderFactory
  jmxProviderStub: JmxProvider
  runnerStub: Runner
  updateLoadProjectStatusRepositoryStub: UpdateLoadProjectStatusRepository
}

const makeSut = (): SutTypes => {
  const findLoadProjectByIdRepositoryStub = makeFindLoadProjectByIdRepositoryStub()
  const { jmxProviderFactoryStub, jmxProviderStub } = makeJmxProviderFactoryStub()
  const runnerStub = makeRunnerStub()
  const updateLoadProjectStatusRepositoryStub = makeUpdateLoadProjectStatusRepositoryStub()
  const dbRunLoadProject = new DbRunLoadProject(findLoadProjectByIdRepositoryStub, jmxProviderFactoryStub, runnerStub, updateLoadProjectStatusRepositoryStub)
  return {
    dbRunLoadProject, findLoadProjectByIdRepositoryStub, jmxProviderFactoryStub, jmxProviderStub, runnerStub, updateLoadProjectStatusRepositoryStub
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
    test('Should call Runner with correct values', async () => {
      const { dbRunLoadProject, runnerStub } = makeSut()
      const runProjectSpy = jest.spyOn(runnerStub, 'runProject')

      await dbRunLoadProject.run({ idProject: 'any_id', qtdRunners: 2 })

      expect(runProjectSpy).toHaveBeenCalledWith({ pathOfProject: 'any path', totalOfRunners: 2 })
    })

    test('Should return a ProjectCanNotBeRunnerError if Runner returns a error', async () => {
      const { dbRunLoadProject, runnerStub } = makeSut()
      jest.spyOn(runnerStub, 'runProject')
        .mockImplementationOnce(async () => new ProjectCanNotBeRunnerError('any_id'))

      const result = await dbRunLoadProject.run({ idProject: 'any_id', qtdRunners: 2 })
      expect(result).toStrictEqual(new ProjectCanNotBeRunnerError('any_id'));
    })

    test('Should trows if Runner trows', async () => {
      const { dbRunLoadProject, runnerStub } = makeSut()
      jest.spyOn(runnerStub, 'runProject')
        .mockImplementationOnce(async () => { throw new Error('Any error') })

      const result = dbRunLoadProject.run({ idProject: 'any_id', qtdRunners: 2 })
      await expect(result).rejects.toStrictEqual(new Error('Any error'));
    })
  })

  describe('UpdateLoadProjectStatusRepository', () => {
    test('Should call UpdateLoadProjectStatusRepository with correct values', async () => {
      const { dbRunLoadProject, updateLoadProjectStatusRepositoryStub } = makeSut()
      const updateStatus = jest.spyOn(updateLoadProjectStatusRepositoryStub, 'updateStatus')

      await dbRunLoadProject.run({ idProject: 'any_id', qtdRunners: 2 })

      expect(updateStatus).toHaveBeenCalledWith({ id: 'any_id', status: StatusProject.RUNNING })
    })
    
    test('Should trows if UpdateLoadProjectStatusRepository trows', async () => {
      const { dbRunLoadProject, updateLoadProjectStatusRepositoryStub } = makeSut()
      jest.spyOn(updateLoadProjectStatusRepositoryStub, 'updateStatus')
        .mockImplementationOnce(async () => { throw new Error('Any error') })

      const result = dbRunLoadProject.run({ idProject: 'any_id', qtdRunners: 2 })
      await expect(result).rejects.toStrictEqual(new Error('Any error'));
    })
  })
})