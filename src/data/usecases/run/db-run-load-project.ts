import { ProjectCanNotBeLoadedError } from '../../../domain/error/project-can-not-be-loaded'
import { ProjectCanNotBeRunnerError } from '../../../domain/error/project-can-not-be-runner'
import { ProjectInProgressError } from '../../../domain/error/project-in-progress-error'
import { ProjectNotFindedError } from '../../../domain/error/project-not-find-error'
import { StatusProject } from '../../../domain/models/status-project'
import { RunLoadProject, RunLoadProjectModel } from '../../../domain/usecases/load-project/run-load-project'
import { JmxProviderFactory } from '../../protocols/jmx-provider/jmx-provider-factory'
import { JmxProvider } from '../../protocols/jmx-provider/JmxProvider'
import { FindLoadProjectByIdRepository } from '../../protocols/load-project/find-load-project-by-id-repository'
import { UpdateLoadProjectStatusRepository } from '../../protocols/load-project/update-load-project-status-repository'
import { Runner } from '../../protocols/runner/runner'

export class DbRunLoadProject implements RunLoadProject {
  constructor(
    private readonly findLoadProjectByIdRepository: FindLoadProjectByIdRepository,
    private readonly jmxProviderFactory: JmxProviderFactory,
    private readonly runner: Runner,
    private readonly updateLoadProjectStatusRepository: UpdateLoadProjectStatusRepository
  ) { }

  async run(runLoadProjectModel: RunLoadProjectModel): Promise<Error> {
    const { idProject, qtdRunners } = runLoadProjectModel
    const projectFinded = await this.findLoadProjectByIdRepository.findLoadProjectById(idProject)
    if (!projectFinded) {
      return new ProjectNotFindedError(idProject)
    }
    if (projectFinded.status === StatusProject.RUNNING) {
      return new ProjectInProgressError(idProject)
    }

    const { provider, specificFields } = projectFinded.jmxProvider
    const jmxProvider: JmxProvider = this.jmxProviderFactory.getJmxProvider(provider)
    const pathToProject = await jmxProvider.getProject(specificFields)
    if (pathToProject instanceof Error) {
      return new ProjectCanNotBeLoadedError(idProject)
    }

    const projectRunner = await this.runner.runProject({ pathOfProject: pathToProject, totalOfRunners: qtdRunners })

    if (projectRunner instanceof Error) {
      return new ProjectCanNotBeRunnerError(idProject)
    }

    await this.updateLoadProjectStatusRepository.updateStatus({ id: projectFinded.id, status: StatusProject.RUNNING })
    return null
  }
}
