import { ProjectInProgressError } from '../../../domain/error/project-in-progress-error'
import { ProjectNotFindedError } from '../../../domain/error/project-not-find-error'
import { StatusProject } from '../../../domain/models/status-project'
import { RunLoadProject, RunLoadProjectModel } from '../../../domain/usecases/load-project/run-load-project'
import { FindLoadProjectByIdRepository } from '../../protocols/load-project/find-load-project-by-id-repository'

export class DbRunLoadProject implements RunLoadProject {
  constructor (
    private readonly findLoadProjectByIdRepository: FindLoadProjectByIdRepository
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
    return null
  }
}
