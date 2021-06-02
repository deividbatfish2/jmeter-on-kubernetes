import { ProjectCanNotBeLoadedError } from '../../../domain/error/project-can-not-be-loaded'
import { ProjectInProgressError } from '../../../domain/error/project-in-progress-error'
import { ProjectNotFindedError } from '../../../domain/error/project-not-find-error'
import { StatusProject } from '../../../domain/models/status-project'
import { RunLoadProject, RunLoadProjectModel } from '../../../domain/usecases/load-project/run-load-project'
import { JmxProviderFactory } from '../../protocols/jmx-provider/jmx-provider-factory'
import { JmxProvider } from '../../protocols/jmx-provider/JmxProvider'
import { FindLoadProjectByIdRepository } from '../../protocols/load-project/find-load-project-by-id-repository'

export class DbRunLoadProject implements RunLoadProject {
  constructor (
    private readonly findLoadProjectByIdRepository: FindLoadProjectByIdRepository,
    private readonly jmxProviderFactory: JmxProviderFactory
  ) { }

  async run (runLoadProjectModel: RunLoadProjectModel): Promise<Error> {
    const { idProject } = runLoadProjectModel
    const projectFinded = await this.findLoadProjectByIdRepository.findLoadProjectById(idProject)
    if (!projectFinded) {
      return new ProjectNotFindedError(idProject)
    }
    if (projectFinded.status === StatusProject.RUNNING) {
      return new ProjectInProgressError(idProject)
    }

    const { provider, specificFields } = projectFinded.jmxProvider
    const jmxProvider: JmxProvider = this.jmxProviderFactory.getJmxProvider(provider)
    const result = await jmxProvider.getProject(specificFields)
    if (result instanceof Error) {
      return new ProjectCanNotBeLoadedError(idProject)
    }
    return null
  }
}
