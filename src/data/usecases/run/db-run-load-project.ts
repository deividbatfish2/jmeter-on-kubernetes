import { ProjectNotFindedError } from '../../../domain/error/project-not-find-error'
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
    return null
  }
}
